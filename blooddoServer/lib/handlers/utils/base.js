'use strict';

const crypto = require('crypto');
const mongoose = require('mongoose');
const moment = require('moment');

const _ = require('underscore');
import parallel from 'async/parallel';


const listToTree = require('./listToTree');

const config = require('../config');


const getRefsByUID = (uid, next) => {
  const Ref = mongoose.model('Ref');
  Ref.find({uid}, 'ranking', (err, refDocs) => {
    if (err) {
      // throw new Error(err);
      return next(err);
    }
    return next(null, refDocs);
  });
};

const calcAvgAndSuperRankingsForUser = (userRefDocs) => {
  // super and avg
  let avgVal = 0;
  let superVal = 0;
  for (let i = 0; i < userRefDocs.length; i++) {
    superVal = superVal + userRefDocs[i].ranking;
  }
  if (userRefDocs.length>0) avgVal = superVal / userRefDocs.length; else avgVal = 0;
  return {avgVal, superVal};
}

const recalcGlobalUserRanking = (next) => {

  const createCalcFunc = (uid) => {
    return (cb) => {
      recalcUser_ur(uid, (err) => {
        if (err) {
          // throw new Error(err);
          return cb(err);
        }

        return cb(null);
      });
    };
  };

  const User = mongoose.model('User');
  User.find({}, (err, userDocs) => {
    let funcs = [];


    for (let i = 0; i < userDocs.length; i++) {
      funcs.push(createCalcFunc(userDocs[i]._id));
    }

    if (funcs.length === 0 ) return next(null);
    parallel(funcs, (err) => {
      if (err) {
        return next(err);
      }
      // recalculated
      return next(null);

    });
  });
};
const recalcCRankings = (cid, next) => {
  // fired when for example owner intro new tags and old are not actual anymore

  const createCalcFunc = (refId) => {
    return (cb) => {
      const Ref = mongoose.model('Ref');
      Ref.findOne({_id:refId}, (err, refDoc) => {
        if (err) {
          // TODO Server error
          throw new Error(err);
          // return cb(err);
        }
        if (refDoc.prId) {
          //////////////////////////////////
          // STAT FUNC
          calcParticipantRanking(refDoc.prId, config.points.np, true);
        }
        if (refDoc.prId && refDoc.tags && refDoc.tags.length>0){
          //////////////////////////////////
          // STAT FUNC
          calcParticipantRanking(refDoc.prId, config.points.ct, false);
          //////////////////////////////////
          // STAT FUNC
          calcParticipantRanking(refDoc._id, config.points.p, false);
        }

        return cb(null);
      });
    };
  };

  const Ref = mongoose.model('Ref');
  Ref.update({cid}, {ranking: 0 }, { multi: true }, (err) => {
    if (err) {
      // TODO server error
      throw new Error(err);
      // return;
    }
    Ref.find({cid}, (err, refDocs) => {
      let funcs = [];


      for (let i = 0; i < refDocs.length; i++) {
        funcs.push(createCalcFunc(refDocs[i]._id));
      }

      if (funcs.length === 0 ) return next(null);
      parallel(funcs, (err) => {
        if (err) {
          // TODO Server error
          throw new Error(err);
          // return next(err);
        }
        // console.log('AGGREGATION C');
        aggregateCRankings(cid, (err) => {
          if (err) {
            // TODO Server error
            throw new Error(err);
            // return next(err);
          }
          // recalcullated

          //////////////////////////////////
          // STAT FUNC to recalc owner's stats
          saveStaticStat_u_top_xx_rank(cid);
          ///////////////////////////////////////////


          return next(null);
        });

      });

    });
  });

};

// updates list of top participants (by rank) of the campaign
const aggregateCRankings = (cid, next) => {
  const Ref = mongoose.model('Ref');
  Ref.find({cid})
  .sort({ranking:-1})
  .populate({path:'uid', select:'name fbId'}) // multiple path names in one requires mongoose >= 3.6
  .exec((err, doc) => {
    if (err) return next(err);
    let filter = _.map(doc, function(obj) {
      let name = (obj.uid ? obj.uid.name : undefined);
      let fbId = (obj.uid ? obj.uid.fbId : undefined);
      let status = 'p';
      if (obj.stats && obj.stats.childC > 0 && obj.tags && obj.tags.length>0) status = 'ac';
      if (obj.stats && obj.stats.childC === 0 && obj.tags && obj.tags.length>0) status = 'a';
      if (obj.stats && obj.stats.childC > 0 && (!obj.tags || obj.tags.length===0)) status = 'c';

      return { ranking: obj.ranking, name, fbId, status, places:[]};
    });

    // saving last 5 changes, based on which the tendency can be calculated
    // cRanking moving like a "worm" consuming places

    for (let i = 0; i<filter.length; i++) {
      filter[i].places = [i];
    }

    const Campaign = mongoose.model('Campaign');
    Campaign.findOne({_id:cid}, 'stats.cRankings', (err, campaignDoc) => {
      if (err) {
        // TODO Server error
        throw new Error(err);
        // return next(err);
      }

      let _cRankings = campaignDoc.stats.cRankings;
      // inserting places
      for (let i = 0; i<filter.length; i++) {
        const oldRank = _.findWhere(_cRankings, {fbId: filter[i].fbId});
        console.log('OLD RANK = '+JSON.stringify(oldRank));
        if (oldRank !== undefined) {
          filter[i].places = filter[i].places.concat(oldRank.places);
          if (filter[i].places.length>4)
          filter[i].places = filter[i].places.slice(filter[i].places.length-4, filter[i].places.length);
        }
      }

      console.log('FILTER = '+JSON.stringify(filter));
      Campaign.findOneAndUpdate({_id:cid}, { $set: { 'stats.cRankings': filter }}, (err) => {
        if (err) {// TODO Server error
          throw new Error(err);// return next(err);
        }

        return next(null);
      });
    });

  });
};

// inc ranking of parent, inc ranking of parent.parent
const calcParticipantRanking = (parentId, points, secondRound) => {
  const Ref = mongoose.model('Ref');
  Ref.findOneAndUpdate({_id:parentId}, { $inc: { 'ranking': points }}, (err, doc) => {
    if (err) {
      // TODO Server error
      throw new Error(err);
      // return;
    }

    //////////////////////////////////
    // STAT FUNC
    // for parent user
    saveStatSnapshot_u_rank_evo(doc.uid);


    if (secondRound && doc.prId) {
      Ref.findOneAndUpdate({_id:doc.prId}, { $inc: { 'ranking': config.points.p2nd }}, (err, doc) => {
        if (err) {
          // TODO Server error
          throw new Error(err);
          // return;
        }
        // console.log('AGGREGATION A');
        //////////////////////////////////
        // STAT FUNC
        aggregateCRankings(doc.cid, () => {
          // recalcullated

          //////////////////////////////////
          // STAT FUNC to recalc owner's stats
          saveStaticStat_u_top_xx_rank(doc.cid);
          ///////////////////////////////////////////

          return;
        });
        //////////////////////////////////
        // STAT FUNC
        // for parent.parent user
        saveStatSnapshot_u_rank_evo(doc.uid);

      });
    } else {
      // console.log('AGGREGATION B');
        //////////////////////////////////
        // STAT FUNC
        aggregateCRankings(doc.cid, () => {
        // recalcullated

        //////////////////////////////////
        // STAT FUNC to recalc owner's stats
        saveStaticStat_u_top_xx_rank(doc.cid);
        ///////////////////////////////////////////

        return;
      });
    }
  });
};

// function is called when adding or deleting campaign tags
// function is deleting irrelevant chosen tags or adding new
const recalcCampaignParticipantsTags = (cid, tags, next) => {

  const createUpdateFunc = (refId, newTags) => {
    return (cb) => {
      const Ref = mongoose.model('Ref');
      Ref.findOneAndUpdate({_id:refId}, { $set: { 'tags': newTags }}, (err, doc) => {
        if (err) {
          // TODO Server error
          throw new Error(err);
          // return cb(err);
        }
        /////////////////////////////
        // cashing tags
        recalcTagsByParticipant(doc.tags, newTags);
        recalcTagsCampaignByParticipant(cid, doc.tags, newTags);
        //////////////////////////////
        return cb(null, doc);
      });
    };
  };

  const Ref = mongoose.model('Ref');
  let funcs = [];
  Ref.find({cid}, (err, docs) => {
    if (err) return next(err);
    for (let i = 0; i < docs.length; i++) {
      if (docs[i].tags && docs[i].tags.length>0 && docs[i].prId) {
        let newTags = _.intersection(tags, docs[i].tags);
        funcs.push(createUpdateFunc(docs[i]._id, newTags));
      }

    }

    if (funcs.length === 0 ) return next(null);

    parallel(funcs, (err) => {
      if (err) {
        // TODO Server error
        throw new Error(err);
        // return next(err);
      }

      return next(null);
    });
  });
};

// function adds (initiates) new tags
// recalc of usage
const recalcTagsByParticipant = (oldTags, newTags) => {
  let funcs = [];
  oldTags = oldTags || [];

  ///update///////////////////////////////////////

  // [] ['tagA', 'tagB'] = +'tagA', +'tagB'
  // difference -[], +[tabA, tagB]

  // ['tagA', 'tagB'] [] = -'tagA', -'tagB'
  // difference -[tagA, tagB], +[]

  // ['tagA', 'tagB'] ['tagA', 'tagB', 'tagC'] = +tagC
  // difference -[], +[tagC]

  // ['tagA', 'tagB'] ['tagA'] = -tagB
  // difference -[tagB], +[]

  const minusTags = _.difference(oldTags, newTags);
  const plusTags = _.difference(newTags, oldTags);

  const createUpdateFunc = (inc, tag) => {
    return (cb) => {
      const Tag = mongoose.model('Tag');
      Tag.findOneAndUpdate({tag:tag}, { $inc: { 'chosen': inc }}, (err, doc) => {
        if (err) {
          // TODO Server error
          throw new Error(err);
          // return cb(err);
        }
        return cb(null, doc);
      });
    };
  };

  for (let i = 0; i < minusTags.length; i++) {
    funcs.push(createUpdateFunc(-1, minusTags[i]));
  }
  for (let i = 0; i < plusTags.length; i++) {
    funcs.push(createUpdateFunc(1, plusTags[i]));
  }

  parallel(funcs, (err) => {
    if (err) {
      // TODO Server error
      throw new Error(err);
      // return;
    }

    return;
  });
};

const freezeTagCampaignByOwner = (cid, tag, next) => {
  const TagCampaign = mongoose.model('TagCampaign');
  TagCampaign.findOne({cid, tag}, (err, tagDoc) => {
    if (err) { return next(err); }
    if (!tagDoc) { return next(err); }
    tagDoc.frozen = true;
    tagDoc.save((err, doc) => {
      if (err) {
        // TODO Server error
        throw new Error(err);
      }
      next(null);
    });
  });
};

const unfreezeTagCampaignByOwner = (cid, tag, next) => {
  const TagCampaign = mongoose.model('TagCampaign');
  TagCampaign.findOne({cid, tag}, (err, tagDoc) => {
    if (err) { return next(err); }
    if (!tagDoc) { return next(err); }
    tagDoc.frozen = false;
    tagDoc.save((err, doc) => {
      if (err) {
        // TODO Server error
        throw new Error(err);
      }
      next(null);
    });
  });
};
// this is called by the owner when initiating tags (creating or changing campaign)
const reinitTagsCampaignByOwner = (cid, oldTags, newTags, next) => {
  let funcs = [];
  oldTags = oldTags || [];
  const minusTags = _.difference(oldTags, newTags);
  const plusTags = _.difference(newTags, oldTags);

  const createUpdateFunc = (create, tag) => {
    return (cb) => {
      const TagCampaign = mongoose.model('TagCampaign');
      // check if present
      TagCampaign.findOne({cid, tag:tag}, (err, tagDoc) => {
        if (err) { throw new Error(err);}

        // if no tag present and create => create
        if (!tagDoc && create) {
          // create tag
          const data = new TagCampaign({
            cid:cid,
            tag:tag,
            udate: Date.now(),
            chosen: 0,
            frozen: false,
            deleted: false
          });

          data.save((err, doc) => {
            if (err) {
              // TODO Server error
              throw new Error(err);
            }
            return cb(null, doc);
          });
        } else if (tagDoc && !create) {
            // if tag present and delete
            tagDoc.deleted = true;
            tagDoc.save((err, doc) => {
              if (err) {throw new Error(err);}
              return cb(null, doc);});
        } else if (tagDoc && create) {
            tagDoc.deleted = false;
            tagDoc.save((err, doc) => {
              if (err) {throw new Error(err);}
              return cb(null, doc);});
        } else {
          // third case
          return cb(null);
        }

      });

    };
  };

  for (let i = 0; i < minusTags.length; i++) {
    funcs.push(createUpdateFunc(false, minusTags[i]));
  }
  for (let i = 0; i < plusTags.length; i++) {
    funcs.push(createUpdateFunc(true, plusTags[i]));
  }

  parallel(funcs, (err) => {
    if (err) {
      // TODO Server error
      throw new Error(err);
      // return;
    }
    if (next) return next();
    return;
  });

}

const reinitTagsByOwner = (oldTags, newTags) => {
  let funcs = [];
  oldTags = oldTags || [];
  const minusTags = _.difference(oldTags, newTags);
  const plusTags = _.difference(newTags, oldTags);

  const createUpdateFunc = (create, tag) => {
    return (cb) => {
      const Tag = mongoose.model('Tag');
      // check if present
      Tag.findOne({tag:tag}, (err, tagDoc) => {
        if (err) { throw new Error(err);}

        // if no tag present and create => create
        if (!tagDoc && create) {
          // create tag
          const data = new Tag({
            tag:tag,
            udate: Date.now(),
            chosen: 0
          });

          data.save((err, doc) => {
            if (err) {
              // TODO Server error
              throw new Error(err);
            }
            return cb(null, doc);
          });
        } else if (tagDoc && !create) {
            // if tag present and delete
            tagDoc.deleted = true;
            tagDoc.save((err, doc) => {
              if (err) {
                // TODO Server error
                throw new Error(err);
              }
              return cb(null, doc);
            });
        } else {
          return cb(null);
        }

      });

    };
  };


  for (let i = 0; i < minusTags.length; i++) {
    funcs.push(createUpdateFunc(false, minusTags[i]));
  }
  for (let i = 0; i < plusTags.length; i++) {
    funcs.push(createUpdateFunc(true, plusTags[i]));
  }

  parallel(funcs, (err) => {
    if (err) {
      // TODO Server error
      throw new Error(err);
      // return;
    }

    return;
  });
};


// this is called when participant chosen tags, by partcipants
// function adds (initiates) new tags
// recalc of usage
const recalcTagsCampaignByParticipant = (cid, oldTags, newTags, next) => {
  let funcs = [];
  oldTags = oldTags || [];

  ///update///////////////////////////////////////

  // [] ['tagA', 'tagB'] = +'tagA', +'tagB'
  // difference -[], +[tabA, tagB]

  // ['tagA', 'tagB'] [] = -'tagA', -'tagB'
  // difference -[tagA, tagB], +[]

  // ['tagA', 'tagB'] ['tagA', 'tagB', 'tagC'] = +tagC
  // difference -[], +[tagC]

  // ['tagA', 'tagB'] ['tagA'] = -tagB
  // difference -[tagB], +[]

  const minusTags = _.difference(oldTags, newTags);
  const plusTags = _.difference(newTags, oldTags);
  console.log('minusTags = '+minusTags);
  console.log('plusTags = '+plusTags);

  const createUpdateFunc = (inc, tag) => {
    return (cb) => {
      const TagCampaign = mongoose.model('TagCampaign');
      // check if present
      TagCampaign.findOneAndUpdate({cid, tag:tag}, { $inc: { 'chosen': inc }}, {upsert:true}, (err, doc) => {
        if (err) {
          // TODO Server error
          throw new Error(err);
          // return cb(err);
        }
        return cb(null, doc);
      });
    };
  };

  for (let i = 0; i < minusTags.length; i++) {
    funcs.push(createUpdateFunc(-1, minusTags[i]));
  }
  for (let i = 0; i < plusTags.length; i++) {
    funcs.push(createUpdateFunc(1, plusTags[i]));
  }



  parallel(funcs, (err) => {
    if (err) {
      // TODO Server error
      throw new Error(err);
      // return;
    }
    if (next) return next();
    return;
  });
};

const getGlobalStats = (next) => {

  let funcs = [];

  // Campaign count
  funcs.push((cb) => {
    getCampaignsCount({}, (err, cC) => {
      return cb(err, {cC});
    });
  });

  // Campaign launched count
  funcs.push((cb) => {
    getCampaignsCount({status:'launched'}, (err, clC) => {
      return cb(err, {clC});
    });
  });

  // Campaign stopped count
  funcs.push((cb) => {
    getCampaignsCount({status:'stopped'}, (err, csC) => {
      return cb(err, {csC});
    });
  });

  // Campaigns top10 by participants
  funcs.push((cb) => {
    getCampaignsTop10By( {'stats.pC':-1}, (err, ct10p) => {
      ct10p = _.map(ct10p, (cObj) => { return { title: cObj.title, status: cObj.status, ldate: cObj.ldate, stats: {pC: cObj.stats.pC}};});
      return cb(err, {ct10p});
    });
  });

  // Campaigns top10 by date
  funcs.push((cb) => {
    getCampaignsTop10By({'ldate':-1}, (err, ct10ld) => {
      ct10ld = _.map(ct10ld, (cObj) => {  return { title: cObj.title, status: cObj.status, ldate: cObj.ldate, stats: {pC: cObj.stats.pC}};});
      return cb(err, {ct10ld});
    });
  });


  // Top10 users by reg date
  funcs.push((cb) => {
    getUsersTop10By({'frd':-1}, (err, ut10frd) => {
      ut10frd = _.map(ut10frd, (uObj) => {  return { name: uObj.name, fbId: uObj.fbId, ll: uObj.ll, frd: uObj.frd};});
      return cb(err, {ut10frd});
    });
  });

  // Top10 users by avg. ranking
  funcs.push((cb) => {
    getUsersTop10By({'stats.uravg':-1}, (err, ut10avg) => {
      ut10avg = _.map(ut10avg, (uObj) => {  return { name: uObj.name, fbId: uObj.fbId, avg: uObj.stats.uravg};});
      return cb(err, {ut10avg});
    });
  });

  // Top10 users by super ranking
  funcs.push((cb) => {
    getUsersTop10By({'stats.ursup':-1}, (err, ut10sup) => {
      ut10sup = _.map(ut10sup, (uObj) => {  return { name: uObj.name, fbId: uObj.fbId, super: uObj.stats.ursup};});
      return cb(err, {ut10sup});
    });
  });

  // All users count
  funcs.push((cb) => {
    getUsersCount({}, (err, uC) => {
      return cb(err, {uC});
    });
  });

  // All users involved in campaigns as participants or owners / count
  funcs.push((cb) => {
    getCampaignUsersCount({}, (err, cuC) => {
      return cb(err, {cuC});
    });
  });

  // All users involved in campaigns as participants / count
  funcs.push((cb) => {
    getCampaignUsersCount({ prId: { $exists: true }}, (err, cpC) => {
      return cb(err, {cpC});
    });
  });

  // All users involved in campaigns as owners / count
  funcs.push((cb) => {
    getCampaignUsersCount({ prId: { $exists: false }}, (err, coC) => {
      return cb(err, {coC});
    });
  });

  // Tags top10 by popularity (chosen)
  funcs.push((cb) => {
    getTagsTop10By({'chosen':-1}, (err, tt10ch) => {
      tt10ch = _.map(tt10ch, (tObj) => {  return { tag: tObj.tag, chosen: tObj.chosen};});
      return cb(err, {tt10ch});
    });
  });

  parallel(funcs, (err, results) => {
    if (err) {
      return next(err);
    }

    let data = {};
    for (let i = 0; i < results.length; i++) {
      data = _.extend(data, results[i]);
    }
    return next(null, data);
  });
};

const recalcStats = (cid, prId) => {
  const Ref = mongoose.model('Ref');
  const Campaign = mongoose.model('Campaign');

  const calc_childC = () => {
    Ref.findOneAndUpdate({_id:prId}, { $inc: { 'stats.childC': 1 }}, () => {
      // return next(null);
    });
  };

  const calc_childCG = (_prId) => {
    Ref.findOneAndUpdate({_id:_prId}, { $inc: { 'stats.childCG': 1 }}, (err, doc) => {
      if (doc && doc.prId) return calc_childCG(doc.prId);
      return;
    });
  };

  const calc_Campaign_Participants = () => {
    Campaign.findOneAndUpdate({_id:cid}, { $inc: { 'stats.pC': 1 }}, () => {
      return;
    });
  };
  calc_childC();
  calc_childCG(prId);
  calc_Campaign_Participants();
};



const saveStatGlobalSnapshot = (next) => {
  return getGlobalStats((err, data) => {
    if (err) {
      return next(err);
    }
    const StatGlobalSnapshot = mongoose.model('StatGlobalSnapshot');
    const snapshot = new StatGlobalSnapshot({
      ts: Date.now(),
      cC:data.cC,
      clC: data.clC,
      csC: data.csC,
      uC: data.uC,
      cuC: data.cuC,
      cpC: data.cpC,
      coC: data.coC
    });
    snapshot.save((err, doc) => {
      if (err) {
        return next(err);
      }
      return next(null, doc);
    });
  });
};

const getTagsCampaign = (cid, next) => {
  const TagCampaign = mongoose.model('TagCampaign');
  TagCampaign.find({cid})
    .select('tag chosen frozen deleted')
    .sort({chosen:-1})
    .exec((err, docs) => {
      return next(err, docs);
    });
};

const getTagsTop10By = (cond, next) => {
  const Tag = mongoose.model('Tag');
  Tag.find({})
    .select('tag chosen')
    .sort(cond)
    .limit(10)
    .exec((err, docs) => {
      return next(err, docs);
    });
};

const getUsersTop10By = (cond, next) => {
  const User = mongoose.model('User');

  User.find({})
    .select('name fbId ll frd stats')
    .sort(cond)
    .limit(10)
    .exec((err, docs) => {
      return next(err, docs);
    });
};

const getCampaignsTop10By = (cond, next) => {
  const Campaign = mongoose.model('Campaign');

  Campaign.find({})
    .select('title status ldate stats')
    .sort(cond)
    .limit(10)
    .exec((err, docs) => {
      return next(err, docs);
    });
};

const getCampaignUsersCount = (cond, next) => {
  const Ref = mongoose.model('Ref');
  Ref.distinct('uid', cond, (err, docs) => {
    return next(err, (docs? docs.length: 0));
  });
};

const getUsersCount = (query, next) => {
  const User = mongoose.model('User');
  User.count(query, (err, uC) => {
    return next(err, uC);
  });
};

const getCampaignsCount = (query, next) => {
  const Campaign = mongoose.model('Campaign');
  Campaign.count(query, (err, cC) => {
    return next(err, cC);
  });
};



const getParticipantsWhoChosenTags = (cid, next) => {
  const Ref = mongoose.model('Ref');
  Ref.find({cid,  tags: { $gt: [] } })
    .select('uid tags resp ranking')
    .populate({path:'uid', select:'name fbId'})
    .exec((err, docs) => {
    if (err) return next(err);
    if (!docs) return next(null, []);

    return next(null, docs);
    });
};
const recalcRefChain = (rlink, next) => {
  const Ref = mongoose.model('Ref');
  const CRefChain = mongoose.model('CRefChain');

  const _getRefChain = (query, result, next) => {
    // look for rlink, must be one!
    Ref.findOne(query)
    .select('cid _id uid prId')
    .populate({path:'uid', select:'name fbId'}) // multiple path names in one requires mongoose >= 3.6
    .exec((err, doc) => {
      if (err) return next(err);
      if (!doc) return next(404);
      result.push({id:doc._id, prId:doc.prId, name: (doc.uid? doc.uid.name: null), fbId: (doc.uid? doc.uid.fbId : null)});

      if (doc && doc.prId) {
        return _getRefChain({_id: doc.prId, cid: doc.cid}, result, next);
      } else {
        return next(null, result);
      }
    });

  };

  _getRefChain({rlink}, [], (err, result) => {
    if (err) {
      // TODO Server error
      if (err === 404) { /* nothing */ }
      else
        throw new Error(err);
    }

    CRefChain.findOneAndUpdate({rlink}, { '$set': {chain:result, lastUpdate: Date.now()}}, {upsert:true, new:true}, (err, doc) =>{
      if (err) {
        // TODO server error
        throw new Error(err);
        // return;
      }

      if (next) return next(null, doc);
      return;
    });
  });
};

const recalcCRefTree = (cid, next) => {
  const Ref = mongoose.model('Ref');
  Ref.find({cid})
    .select('_id uid prId')
    .populate({path:'uid', select:'name fbId'}) // multiple path names in one requires mongoose >= 3.6
    .exec((err, docs) => {
      // handle err
      // usersDocuments formatted as desired

      let mydocs = [];
      let idIndex = [];
      for (let i=0; i<docs.length; i++){
        let id = _.indexOf(idIndex, docs[i]._id)+1;
        if (id<=0) {
          id=idIndex.push(docs[i]._id.toString());
        }

        let prId = 0;
        if (docs[i].prId) {
          prId = _.indexOf(idIndex, docs[i].prId)+1;
          if (prId<=0) {
            prId = idIndex.push(docs[i].prId.toString());
          }
        }

        mydocs.push({id, name: (docs[i].uid? docs[i].uid.name: null), fbId: (docs[i].uid? docs[i].uid.fbId:null), prId});
      }

      const tree = listToTree(mydocs, {idKey:'id', parentKey:'prId'});
      const CRefTree = mongoose.model('CRefTree');
      CRefTree.findOneAndUpdate({cid}, { '$set': {tree:tree, lastUpdate: Date.now()}}, {upsert:true, new:true}, (err) =>{
        if (err) {
          // TODO server error
          throw new Error(err);
          // return;
        }

        return next(null);
      });

    });
};

// const wasParticipantAlreadyCommunicator = (id, next) => {
//   const Ref = mongoose.model('Ref');
//   Ref.count({ prId: id }, (err, amount) => {
//     if (err) return next(err);
//     if (amount > 1) return next(null, true);
//     else return next(null, false);
//   }});
// };

// const wasParticipantAlreadyActive = (id, next) => {
//   const Ref = mongoose.model('Ref');
//   Ref.findOne({ _id: id }, (err, doc) => {
//     if (err) return next(err);
//     if (doc.tags && doc.tags.length > 0) return next(null, true);
//     return next(null, false);
//   }});
// };

const getRefNodeByRLink = (rlink, next) => {
  const Ref = mongoose.model('Ref');
  if (!rlink) return next(null, null);
  Ref.findOne({ rlink: rlink }, (err, userDoc) => {
    if (err) return next('err');
    if (!userDoc) return next('err');
    return next(null, userDoc);
  });
};

const getCampaignByRLink = (rlink, next) => {
  const Ref = mongoose.model('Ref');
  if (!rlink) return next(null, null);
  Ref.findOne({ rlink: rlink }, (err, refDoc) => {
    if (err) return next('err');
    if (!refDoc) return next('err');
    const Campaign = mongoose.model('Campaign');
    Campaign.findOne({ _id: refDoc.cid }, (err, campaignDoc) => {
      if (err) return next('err');
      if (!campaignDoc) return next('err');
      return next(null, campaignDoc);
    });
  });
};

const getCampaignByDLink = (dlink, next) => {
  const Ref = mongoose.model('Ref');
  if (!dlink) return next(null, null);
  Ref.findOne({ dlink }, (err, refDoc) => {
    if (err) return next(err);
    if (!refDoc) return next('err');
    const Campaign = mongoose.model('Campaign');
    Campaign.findOne({ _id: refDoc.cid }, (err, campaignDoc) => {
      if (err) return next(err);
      if (!campaignDoc) return next('err');
      return next(null, campaignDoc);
    });
  });
};

const getRefNodeByDLink = (dlink, next) => {
  const Ref = mongoose.model('Ref');
  Ref.findOne({ dlink }, (err, userDoc) => {
    if (err) return next('err');
    if (!userDoc) return next('err');
    return next(null, userDoc);
  });
};

const getRefNodeBy_CID_UID = (cid, uid, next) => {
  const Ref = mongoose.model('Ref');
  Ref.findOne({ cid, uid }, (err, userDoc) => {
    if (err) return next('err');
    return next(null, userDoc);
  });
};

const getUser = (query, next) => {
  const User = mongoose.model('User');
  User.findOne(query, (err, refDoc) => {
    return next(err, refDoc);
  });
};

const getCampaign = (query, next) => {
  const Campaign = mongoose.model('Campaign');
  Campaign.findOne(query, (err, campaignDoc) => {
    return next(err, campaignDoc);
  });
};

const updateRef = (query, change, next) => {
  const Ref = mongoose.model('Ref');
  Ref.findOneAndUpdate(query, { $set: change }, (err, refDoc) => {
    return next(err, refDoc);
  });
};

const getCampaignHierarchy = (dlink, next) => {
  const Ref = mongoose.model('Ref');
  const CRefTree = mongoose.model('CRefTree');
  // get cid
  Ref.findOne({dlink}, 'cid', (err, doc) => {
    if (err) return next(500);
    if (!doc) return next(404);
    // get all ref nodes related to c
    return CRefTree.findOne({cid:doc.cid}, next);
  });

};

// create new ref node and relate it with the parent
const createRefNode = ({dlink, rlink, cid, uid, prlink, tags, resp}, cb) => {
  const getNewRefLink = (cid, ts, uid) => {
    const phrase = 'ref'+cid+ts+uid;
    return crypto.createHash('md5').update(phrase).digest('hex');
  };

  const getNewDashLink = (cid, ts, uid) => {
    const phrase = 'dash'+cid+ts+uid;
    return crypto.createHash('sha1').update(phrase).digest('hex');
  };

  // look for parent
  getRefNodeByRLink(prlink, (err, parent) => {
    if (err) return cb(err);
    //grabbing parent's cid if no cid sent as param (only the case of root node)
    if (!cid) cid = parent.cid;

    // create child node
    const ts = Date.now();

    // this is only for generating child ref nodes
    if (!rlink) rlink = getNewRefLink(cid, ts, uid);
    if (!dlink) dlink = getNewDashLink(cid, ts, uid);
    ////////////////////////////////////////////////

    let refData = {
      cid,
      uid,
      rlink,
      dlink,
      invitation: '/invitations/'+dlink+'/invitation.html',
      tags,
      resp,
      rdate:ts
    };

    if (parent) refData.prId = parent._id;
    createRef(refData, (err, refDoc) => {

      ///////////////////////////////////////////
      // calc user scores: new participant produced
      if (parent) {
        //////////////////////////////////
        // STAT FUNC
        calcParticipantRanking(refData.prId, config.points.np, true);
      }
      if (parent && tags && tags.length>0){
        //////////////////////////////////
        // STAT FUNC
        calcParticipantRanking(refData.prId, config.points.ct, false);
        //////////////////////////////////
        // STAT FUNC
        calcParticipantRanking(refDoc._id, config.points.p, false);
      }
      //////////////////////////////////////////
      return cb(err, refDoc);
    });

  });
};



const createRef = (refData, next) => {
  const Ref = mongoose.model('Ref');

  const ref = new Ref(refData);
  ref.save((err, refDoc) => {
    if (err) {
      if (err.name === 'ValidationError') return next(400);
      return next(500);
    }
    else {
      return next(null, refDoc);
    }
  });

};

const createCampaign = (campaignData, next) => {

  const Campaign = mongoose.model('Campaign');

  const cc = () => {
    const ts = Date.now();
    campaignData.ldate = ts;

    const campaign = new Campaign(campaignData);

    campaign.save((err, campaignDoc) => {
      if (err) return next(500);
      else {
        /////////////////////////////
        // cashing tags
        if (campaignDoc.tags) {
          reinitTagsByOwner(null, campaignDoc.tags);
          reinitTagsCampaignByOwner(campaignDoc._id, null, campaignDoc.tags);
        }
        //////////////////////////////

        return next(null, campaignDoc);
      }
    });
  };

  try {
    cc();
  } catch (err) {
    return next(500);
  }
};

const initUserStatSnapshots = (collection, uid, userRegDate) => {
  console.log(collection);
  let Dokument = mongoose.model(collection);

  const initUserEvoStat = new Dokument({
    uid,
    goffset: 0,
    ts: userRegDate,
    ucc: 0,
    ucp: 0,
    uch: 0,
    ursup: 0,
    uravg: 0
  });

  initUserEvoStat.save((err, doc) => {
    if (err) {
      // TODO Server error
      throw new Error(err);
    }
    return;
  });


};
const createUser = (userData, next) => {
  const User = mongoose.model('User');
  const cu = () => {
    let ts = Date.now();
    const user = new User({
      fbId: userData.userID,
      name: userData.name,
      ll: ts,
      frd: ts,
      caId: crypto.createHash('md5').update(userData.accessToken).digest('hex'),
    });

    user.save((err, userDoc) => {
      if (err) return next(500);
      else {

        initUserStatSnapshots('UserStatSnapshot_1h', userDoc._id, userDoc.frd);
        initUserStatSnapshots('UserStatSnapshot_1d', userDoc._id, userDoc.frd);
        initUserStatSnapshots('UserStatSnapshot_1w', userDoc._id, userDoc.frd);
        initUserStatSnapshots('UserStatSnapshot_1m', userDoc._id, userDoc.frd);
        initUserStatSnapshots('UserStatSnapshot_1y', userDoc._id, userDoc.frd);
        return next(null, userDoc);
      }
    });
  };

  try {
    cu();
  } catch (err) {
    return next(500);
  }
};

const getUFolder = (dlink, uid, next) => {
  const Campaign = mongoose.model('Campaign');
  Campaign.findOne({dlink, uid}, next);
}

// Called by snapshot function to inc user ucc counter
const incUser_ucc = (uid, next) => {
  const User = mongoose.model('User');
  User.findOneAndUpdate({_id:uid}, { $inc: { 'stats.ucc': 1 }}, {upsert:false, new:true}, (err, doc) => {
    return next(err, doc.stats.ucc);
  });
};

// Called by snapshot function to inc campaign cp counter
const incCampaign_cp = (cid, next) => {
  const Campaign = mongoose.model('Campaign');
  Campaign.findOneAndUpdate({_id:cid}, { $inc: { 'stats.cp': 1 }}, {upsert:false, new:true}, (err, doc) => {
    return next(err, doc.stats.cp);
  });
};

// Called by snapshot function to inc campaign ch counter
const incCampaign_ch = (cid, incr, next) => {
  const Campaign = mongoose.model('Campaign');
  Campaign.findOneAndUpdate({_id:cid}, { $inc: { 'stats.ch': incr }}, {upsert:false, new:true}, (err, doc) => {
    return next(err, doc.stats.ch);
  });
};

// Called by snapshot function to inc user ucp counter
const incUser_ucp = (uid, next) => {
  const User = mongoose.model('User');
  User.findOneAndUpdate({_id:uid}, { $inc: { 'stats.ucp': 1 }}, {upsert:false, new:true}, (err, doc) => {
    return next(err, doc.stats.ucp);
  });
};

// Called by snapshot function to inc/dec user ucp counter
const incUser_uch = (uid, incr, next) => {
  const User = mongoose.model('User');
  User.findOneAndUpdate({_id:uid}, { $inc: { 'stats.uch': incr }}, {upsert:false, new:true}, (err, doc) => {
    return next(err, doc.stats.uch);
  });
};

const updateCampaign_apc = (uid, cid, next) => {
  const Ref = mongoose.model('Ref');
  const Campaign = mongoose.model('Campaign');
  Ref.find({cid}, 'tags stats', (err, refDocs) => {
    let apc = {a:0, p:0, c:0, ac:0};
    for(let i=0; i<refDocs.length; i++) {
      console.log('REF '+JSON.stringify(refDocs[i]));
      let active = (refDocs[i].tags && refDocs[i].tags.length > 0);
      let communicator = (refDocs[i].stats.childC > 0);

      // console.log('ACTIVE =' + active);
      // console.log('COMMUNICATOR =' + communicator);
      if (active && !communicator) apc.a++;
      else if (!active && communicator) apc.c++;
      else if (active && communicator) apc.ac++;
      else apc.p++;
    }
    console.log('APC = '+JSON.stringify(apc));
    Campaign.findOneAndUpdate({_id:cid}, { $set: {'stats.c_apc': apc} }, {upsert:false, new:true}, next);
  });
}

// Called by snapshot function to recalc user apc
const updateUser_apc = (uid, next) => {
  const Campaign = mongoose.model('Campaign');
  const User = mongoose.model('User');
  Campaign.find({uid}, '_id stats', (err, campaigns) => {
    let apc = {a:0, p:0, c:0, ac:0};
    for (let i=0;i<campaigns.length;i++) {
      console.log('STATS '+JSON.stringify(campaigns[i].stats.c_apc));
      apc.a = apc.a + campaigns[i].stats.c_apc.a;
      apc.p = apc.p + campaigns[i].stats.c_apc.p;
      apc.c = apc.c + campaigns[i].stats.c_apc.c;
      apc.ac = apc.ac + campaigns[i].stats.c_apc.ac;
    }
    console.log('USER SUM '+JSON.stringify(apc));
    User.findOneAndUpdate({_id:uid}, { $set: {'stats.u_apc': apc} }, {upsert:false, new:true}, (err, doc) => {
      if (next) return next(doc);
    });
  });

};


// Called by snapshot function to recalc user ur counter
const recalcUser_ur = (uid, next) => {
  getRefsByUID(uid, (err, refDocs) => {
    if (err) return next(err);
    const result = calcAvgAndSuperRankingsForUser(refDocs);
    // update user
    const User = mongoose.model('User');
    User.findOneAndUpdate({_id:uid}, { $set: {'stats.uravg': result.avgVal, 'stats.ursup': result.superVal} }, {upsert:false, new:true}, (err, doc) => {
      return next(err, {uravg: doc.stats.uravg, ursup: doc.stats.ursup});
    });
  });
};

function tsDiff(utcDateTime, scale) {
  let a = moment(utcDateTime);
  let b = moment();
  const days = b.diff(a, scale);
  return days;
}

const getUIDByCID = (cid, next) => {
  const Campaign = mongoose.model('Campaign');
  Campaign.findOne({_id:cid}, (err, doc) => {
    if (err) return next(err);
    return next(null, doc.uid);
  });
};

const calcGOffset = (regDate, next) => {
  const scale = (process.env.ONE_HOUR || 'hours');
  const goffsetHours = tsDiff(regDate, scale)+1; // hours in production!
  const goffsetDays = Math.trunc(goffsetHours/24)+1;
  const goffsetWeeks = Math.trunc(goffsetDays/7)+1;
  const goffsetMonths = Math.trunc(goffsetDays/30)+1;
  const goffsetYears = Math.trunc(goffsetMonths/12)+1;
  return next (null, {goffsetHours, goffsetDays, goffsetWeeks, goffsetMonths, goffsetYears});
};

const getUserGOffsets = (uid, next) => {
  getUser({_id:uid}, (err, userDoc) => {
    if (err) return next(err);
    calcGOffset(userDoc.frd, next);
  });
};

const getCampaignGOffsets = (cid, next) => {
  getCampaign({_id:cid}, (err, campaignDoc) => {
    if (err) return next(err);
    calcGOffset(campaignDoc.ldate, next);
  });
};

const updateUserTopXXParticipants = (uid, next) => {
  // get tops of all campaigns
  // combine arrays by fbId
  // calc for users with serveral ranking avg.
  // calc for users with serveral ranking sup.
  const Campaign = mongoose.model('Campaign');
  Campaign.find({uid}, 'stats.cRankings', (err, docs) => {
    // TODO
    // ...
    const allRankingsGroupedByNameMergedSorted = _.sortBy(_.map(_.groupBy(_.flatten(_.map(docs, (obj)=> { return obj.stats.cRankings })), 'name'), (obj) => {
      const fbId = obj[0].fbId;
      const name = obj[0].name;
      let rank = 0;
      for(let i=0;i<obj.length; i++) {
        rank = rank + obj[i].ranking;
      }
      const crankavg = rank/obj.length;
      return {fbId, name, crankavg:crankavg, cranksup:rank, crank:(crankavg+rank)/2};
    }), 'cranksup' /*sorted by */);

    const User = mongoose.model('User');
    User.findOneAndUpdate({_id:uid}, { $set: { 'stats.utxxp': allRankingsGroupedByNameMergedSorted }}, {upsert:false, new:true}, (err)=>{
      if (err) { throw new Error(err);/* document error */}
      if (next) return next(result);
      return;
    });
  });
}
const updateStatSnapshot_x = (query, model, data, next) => {
  const Snapshot_x_Collection = mongoose.model(model);
  const upd = Object.assign({ts:Date.now()}, data);
  Snapshot_x_Collection.findOneAndUpdate(query, { '$set': upd}, {upsert:true, new:true}, (err, doc) =>{
    if (err) {if (next) return next(err);}
    if (next) return next(null);
    return;
  });
};

// called when campaign created
const saveStatSnapshot_u_c_count_evo = (uid, next) => {
  getUserGOffsets(uid, (err, goffsets) => {
    if (err) { /* Document ! */ return; }
    incUser_ucc(uid, (err, ucc) => {
      if (err) { /* Document ! */ return; }
      // save into 1hour snapshot data
      updateStatSnapshot_x({uid, goffset:goffsets.goffsetHours}, 'UserStatSnapshot_1h', { ucc } );
      updateStatSnapshot_x({uid, goffset:goffsets.goffsetDays}, 'UserStatSnapshot_1d',  { ucc });
      updateStatSnapshot_x({uid, goffset:goffsets.goffsetWeeks}, 'UserStatSnapshot_1w',  { ucc });
      updateStatSnapshot_x({uid, goffset:goffsets.goffsetMonths}, 'UserStatSnapshot_1m',  { ucc });
      updateStatSnapshot_x({uid, goffset:goffsets.goffsetYears}, 'UserStatSnapshot_1y',  { ucc });
    });
  });
};

// called when user joined
// campaign participants evo
const saveStatSnapshot_c_part_evo = (cid, next) => {
  getCampaignGOffsets(cid, (err, goffsets) => {
    if (err) { /* Document ! */ return; }
    incCampaign_cp(cid, (err, cp) => {
      if (err) { /* Document ! */ return; }
      // save into 1hour snapshot data
      updateStatSnapshot_x({cid, goffset:goffsets.goffsetHours}, 'CampaignStatSnapshot_1h', { cp });
      updateStatSnapshot_x({cid, goffset:goffsets.goffsetDays}, 'CampaignStatSnapshot_1d', { cp });
      updateStatSnapshot_x({cid, goffset:goffsets.goffsetWeeks}, 'CampaignStatSnapshot_1w', { cp });
      updateStatSnapshot_x({cid, goffset:goffsets.goffsetMonths}, 'CampaignStatSnapshot_1m', { cp });
      updateStatSnapshot_x({cid, goffset:goffsets.goffsetYears}, 'CampaignStatSnapshot_1y', { cp });

    });
  });
};

// called when user chooses or unchooses a tag (when joingin or changing campaign)
const saveStatSnapshot_c_help_evo = (cid, incr, next) => {
  getCampaignGOffsets(cid, (err, goffsets) => {
    if (err) { /* Document ! */ throw new Error(err); }
    incCampaign_ch(cid, incr, (err, ch) => {

      if (err) { /* Document ! */ return; }
      // save into 1hour snapshot data
      updateStatSnapshot_x({cid, goffset:goffsets.goffsetHours}, 'CampaignStatSnapshot_1h', { ch });
      updateStatSnapshot_x({cid, goffset:goffsets.goffsetDays}, 'CampaignStatSnapshot_1d', { ch });
      updateStatSnapshot_x({cid, goffset:goffsets.goffsetWeeks}, 'CampaignStatSnapshot_1w', { ch });
      updateStatSnapshot_x({cid, goffset:goffsets.goffsetMonths}, 'CampaignStatSnapshot_1m', { ch });
      updateStatSnapshot_x({cid, goffset:goffsets.goffsetYears}, 'CampaignStatSnapshot_1y', { ch });
    });
  });
};

// called when user joined
// user participants evo
const saveStatSnapshot_u_c_part_evo = (cid, next) => {
  getUIDByCID(cid, (err, uid) => {
    getUserGOffsets(uid, (err, goffsets) => {
      if (err) { /* Document ! */ return; }
      incUser_ucp(uid, (err, ucp) => {
        if (err) { /* Document ! */ return; }
        // save into 1hour snapshot data
        updateStatSnapshot_x({uid, goffset:goffsets.goffsetHours}, 'UserStatSnapshot_1h', { ucp });
        updateStatSnapshot_x({uid, goffset:goffsets.goffsetDays}, 'UserStatSnapshot_1d', { ucp });
        updateStatSnapshot_x({uid, goffset:goffsets.goffsetWeeks}, 'UserStatSnapshot_1w', { ucp });
        updateStatSnapshot_x({uid, goffset:goffsets.goffsetMonths}, 'UserStatSnapshot_1m', { ucp });
        updateStatSnapshot_x({uid, goffset:goffsets.goffsetYears}, 'UserStatSnapshot_1y', { ucp });

      });
    });
  });
};


// called when user chooses or unchooses a tag (when joingin or changing campaign)
const saveStatSnapshot_u_c_help_evo = (cid, incr, next) => {
  getUIDByCID(cid, (err, uid) => {
    getUserGOffsets(uid, (err, goffsets) => {
      if (err) { /* Document ! */ return; }
      incUser_uch(uid, incr, (err, uch) => {
        if (err) { /* Document ! */ return; }
        // save into 1hour snapshot data
        updateStatSnapshot_x({uid, goffset:goffsets.goffsetHours}, 'UserStatSnapshot_1h', { uch });
        updateStatSnapshot_x({uid, goffset:goffsets.goffsetDays}, 'UserStatSnapshot_1d', { uch });
        updateStatSnapshot_x({uid, goffset:goffsets.goffsetWeeks}, 'UserStatSnapshot_1w', { uch });
        updateStatSnapshot_x({uid, goffset:goffsets.goffsetMonths}, 'UserStatSnapshot_1m', { uch });
        updateStatSnapshot_x({uid, goffset:goffsets.goffsetYears}, 'UserStatSnapshot_1y', { uch });
      });
    });
  });
};

// called when user joins campaign, successfully invites further participants to campaigns chooses or unchooses a tag
// recalcullation
const saveStatSnapshot_c_apc = (cid, next) => {
  getUIDByCID(cid, (err, uid) => {
    updateCampaign_apc(uid, cid, () => {
      updateUser_apc(uid, next);
    });
  });
};

// called when user chooses or unchooses a tag (when joingin or changing campaign)
const saveStatSnapshot_u_rank_evo = (uid, next) => {
  getUserGOffsets(uid, (err, goffsets) => {
    if (err) { /* Document ! */ return; }
    recalcUser_ur(uid, (err, {ursup, uravg}) => {
      if (err) { /* Document ! */ return; }
      // save into 1hour snapshot data
      updateStatSnapshot_x({uid, goffset:goffsets.goffsetHours}, 'UserStatSnapshot_1h', { ursup, uravg });
      updateStatSnapshot_x({uid, goffset:goffsets.goffsetDays}, 'UserStatSnapshot_1d', { ursup, uravg });
      updateStatSnapshot_x({uid, goffset:goffsets.goffsetWeeks}, 'UserStatSnapshot_1w', { ursup, uravg });
      updateStatSnapshot_x({uid, goffset:goffsets.goffsetMonths}, 'UserStatSnapshot_1m', { ursup, uravg });
      updateStatSnapshot_x({uid, goffset:goffsets.goffsetYears}, 'UserStatSnapshot_1y', { ursup, uravg });
    });
  });
};

// called when user joins, chooses or unchooses a tag
const saveStaticStat_u_top_xx_rank = (cid_WhereRankingChangeHappened, next) => {
  // based on ready cRankings for each campaign
  getUIDByCID(cid_WhereRankingChangeHappened, (err, uid) => {
    // uid = owner of the campaign
    if (err) { /* Document ! */ return; }
    updateUserTopXXParticipants(uid, next);
  });
};

const getScaleSnapshotDocument = (startingDate, level, snapshotMap) => {
  let Document = null;
  const scale = (process.env.ONE_HOUR || 'hours');
  let limit = 0;
  if (level === '1h') {
    Document = mongoose.model(snapshotMap['1h']);
    limit = 24; // last 24h
  }
  if (level === '1d') {
    Document = mongoose.model(snapshotMap['1d']);
    limit = 7*24; // last 7 days by hour
  }

  if (level === '1w') {
    Document = mongoose.model(snapshotMap['1w']);
    limit = 4; // last 4 weeks
  }

  if (level === '1m') {
    Document = mongoose.model(snapshotMap['1m']);
    limit = 12; // last 12 months
  }

  if (level === '1y') {
    Document = mongoose.model(snapshotMap['1y']);
    limit = 5; // last 5 years
  }

  return {Document, limit};
};

const extractEvoCampaignStat = (dlink, statIdselectStr, level, precision, next) => {

  if (!level || !precision || !dlink){
    return next(400, {err:'400'});
  }

  getCampaignByDLink(dlink, (err, campaignDoc) => {
    if (err) return(err);
    continueExtract(campaignDoc);
  });

  function continueExtract(campaignDoc) {
    // 1. currentGoffset is current point of time (since registration date of the user)
    const scale = (process.env.ONE_HOUR || 'hours');
    let {Document, limit, currentGoffset} = getScaleSnapshotDocument(campaignDoc.ldate, level, {
      '1h':'CampaignStatSnapshot_1h',
      '1d':'CampaignStatSnapshot_1h',
      '1w':'CampaignStatSnapshot_1w',
      '1m':'CampaignStatSnapshot_1m',
      '1y':'CampaignStatSnapshot_1y'
    });

    Document.find({cid: campaignDoc._id}).select('goffset '+statIdselectStr).sort({goffset:-1}).limit(limit).exec((err, docs) => {
      if (err) {return next(err);}
      if (!docs || docs.length===0) return next(null,[]);
      console.log('extraction: '+JSON.stringify(docs));
      return next(null, docs);
    });
  }
};


const extractEvoUserStat = (uid, statIdselectStr, level, precision, next) => {
  if (!level || !precision){
    return next(400, {err:'400'});
  }
  getUser({_id:uid}, (err, userDoc) => {
      if (err) return(err);
      continueExtract(userDoc);
  });

  function continueExtract(userDoc) {
    // 1. currentGoffset is current point of time (since registration date of the user)
    let {Document, limit} = getScaleSnapshotDocument(userDoc.frd, level, {
      '1h':'UserStatSnapshot_1h',
      '1d':'UserStatSnapshot_1h',
      '1w':'UserStatSnapshot_1w',
      '1m':'UserStatSnapshot_1m',
      '1y':'UserStatSnapshot_1y'
    });


    Document.find({uid}).select('goffset '+statIdselectStr).sort({goffset:-1}).limit(limit).exec((err, docs) => {
      if (err) {return next(err);}
      if (!docs || docs.length===0) return next(null,[]);
      console.log('extraction: '+JSON.stringify(docs));
      return next(null, docs);
    });

  }
};

const extractStaticStatUser = (uid, statIds, xx, next) => {

  let Document = mongoose.model('User');
  Document.findOne({_id:uid}).select('stats').exec((err, doc) => {
    if (err) {return next(err);}

    //let results = [];
    let results = null;
    for (let i = 0; i<statIds.length;i++) {
      if (statIds[i]==='utxxp') {
        //  results.push({ utxxp : _.map(doc.stats.utxxp.slice(Math.max(doc.utxxp - xx, 1)), (obj) => { return {cranksup: obj.cranksup, crankavg: obj.crankavg, name:obj.name, fbId:obj.fbId };})});
        results = { utxxp : _.map(doc.stats.utxxp.slice(Math.max(doc.utxxp - xx, 1)), (obj) => { return {cranksup: obj.cranksup, crankavg: obj.crankavg, name:obj.name, fbId:obj.fbId };})};
      }

      if (statIds[i]==='u_apc') {
         //results.push({ u_apc : doc.stats.u_apc});
         results = { u_apc : doc.stats.u_apc};
      }

    }
    //console.log('U_apc RESULTS '+JSON.stringify(results));
    return next(null, results);
  });
}

const extractStaticStatCampaign = (dlink, statIds, xx, next) => {

  let Document = mongoose.model('Campaign');

  Document.findOne({dlink}).select('stats').exec((err, doc) => {
    if (err) {return next(err);}

    // let results = [];
    let results = null;
    for (let i = 0; i<statIds.length;i++) {

      if (statIds[i]==='c_apc') {
        //  results.push({ c_apc : doc.stats.c_apc});
        results = { c_apc : doc.stats.c_apc};
      }

    }
    //console.log('C_apc RESULTS '+JSON.stringify(results));
    return next(null, results);
  });
}


const extractStat = ({dlink, uid, statIds, level, xx, precision}, next) => {
  const createEvoUserStatExtractionFunc = (statIdselectStr) => {
    return (cb) => {
      extractEvoUserStat(uid, statIdselectStr, level, precision, (err, stat) => {
        //console.log('STAT:'+stat);
        if (err) { return cb(err); }
        return cb(null, {evo:stat});
      });

    };
  };

  const createEvoCampaignStatExtractionFunc = (statIdselectStr) => {
    return (cb) => {
      extractEvoCampaignStat(dlink, statIdselectStr, level, precision, (err, stat) => {
        //console.log('STAT:'+stat);
        if (err) { return cb(err); }
        return cb(null, {evo:stat});
      });

    };
  };

  const createStaticStatUserExtractionFunc = (statIds, xx) => {
    return (cb) => {

      extractStaticStatUser(uid, statIds, xx, (err, stat) => {
        if (err) { return cb(err); }
        return cb(null, stat);
      });

    };
  };


  const createStaticStatCampaignExtractionFunc = (statIds, xx) => {
    return (cb) => {

      extractStaticStatCampaign(dlink, statIds, xx, (err, stat) => {
        if (err) { return cb(err); }
        return cb(null, stat);
      });

    };
  };

  let funcs = [];

  // put stat id with same extraction mechanism together
  // for evo ids all fields can be therefore selected in one find operaiton
  let evoUserStatIds = '';
  let evoCampaignStatIds = '';
  let staticStatUserIds = [];
  let staticStatCampaignIds = [];
  let i = statIds.length;
  while (i--) {
    console.log('statIds[i]='+statIds[i]);

    // for extraction of user stats
    if (statIds[i]==='ucc' || statIds[i]==='ucp' || statIds[i]==='uch' || statIds[i]==='uravg' || statIds[i]==='ursup') evoUserStatIds = evoUserStatIds + ' ' + statIds[i].slice();
    if (statIds[i] === 'u_apc' || statIds[i] === 'utxxp') staticStatUserIds.push(statIds[i].slice());
    if (statIds[i] === 'c_apc') staticStatCampaignIds.push(statIds[i].slice());

    // for extraction of campaign stats
    if (statIds[i]==='cp' || statIds[i]==='ch') evoCampaignStatIds = evoCampaignStatIds + ' ' + statIds[i].slice();
  }

  console.log('evoUserStatIds='+evoUserStatIds);
  console.log('evoCampaignStatIds='+evoCampaignStatIds);
  console.log('staticStatUserIds='+staticStatUserIds);
  console.log('staticStatCampaignIds='+staticStatCampaignIds);

  // Pushin evo user stat extraction
  if (evoUserStatIds) funcs.push(createEvoUserStatExtractionFunc(evoUserStatIds));
  // Pushin evo campaign stat extraction
  if (evoCampaignStatIds) funcs.push(createEvoCampaignStatExtractionFunc(evoCampaignStatIds));

  // Pushin static stat extraction
  if (staticStatUserIds.length>0) funcs.push(createStaticStatUserExtractionFunc(staticStatUserIds, xx));
  if (staticStatCampaignIds.length>0) funcs.push(createStaticStatCampaignExtractionFunc(staticStatCampaignIds, xx));

  if (funcs.length === 0 ) return next(null, {});

  parallel(funcs, (err, results) => {
    if (err) return next(500, []);
    console.log('RES1 '+JSON.stringify(results));
    // results = _.flatten(results);
    // if (err) {
    //   console.log('RETURNING ERROR!');
    //   return next(err);
    // }
    // let data = {};
    // for (let i = 0; i < results.length; i++) {
    //   data = _.extend(data, results[i]);
    // }
    //console.log('RES2 '+JSON.stringify(data));

    let data = _.map(results, (obj) => {
      if (obj.u_apc) return {u_apc:obj.u_apc};
      if (obj.c_apc) return {c_apc:obj.c_apc};
      if (obj.utxxp) return {utxxp:obj.utxxp};
      if (obj.evo) {
        return {evo:_.map(obj.evo, (goffsetObj) => {
          let data = {};
          if (typeof goffsetObj.goffset !== 'undefined') data.goffset = goffsetObj.goffset;
          if (goffsetObj.ucc) data.ucc = goffsetObj.ucc;
          if (goffsetObj.ucp) data.ucp = goffsetObj.ucp;
          if (goffsetObj.uch) data.uch = goffsetObj.uch;
          if (goffsetObj.uravg) data.uravg = goffsetObj.uravg;
          if (goffsetObj.ursup) data.ursup = goffsetObj.ursup;
          if (goffsetObj.cp) data.cp = goffsetObj.cp;
          if (goffsetObj.ch) data.ch = goffsetObj.ch;
          return data;
        })};
      }
    });

    console.log('RES2 '+JSON.stringify(data));

    return next(null, data);

  });

}

export {
  createUser,
  createCampaign,
  createRef,
  createRefNode,

  recalcRefChain,
  recalcCRefTree,
  recalcStats,
  recalcTagsByParticipant,
  recalcTagsCampaignByParticipant,
  recalcCampaignParticipantsTags,
  calcParticipantRanking,
  recalcCRankings,
  recalcGlobalUserRanking,

  getCampaignHierarchy,
  getCampaignByRLink,
  getGlobalStats,
  getTagsCampaign,
  getRefNodeByDLink,
  getRefNodeByRLink,
  getRefNodeBy_CID_UID,

  getUser,
  getUFolder,
  getParticipantsWhoChosenTags,
  // wasParticipantAlreadyActive,
  // wasParticipantAlreadyCommunicator

  updateRef,

  saveStatGlobalSnapshot,

  reinitTagsCampaignByOwner,
  reinitTagsByOwner,
  freezeTagCampaignByOwner,
  unfreezeTagCampaignByOwner,
  extractStat,

  // user
  saveStatSnapshot_u_c_count_evo,
  saveStatSnapshot_u_c_part_evo,
  saveStatSnapshot_u_c_help_evo,
  saveStatSnapshot_c_apc, // u_apc will be here also recalculated

  // campaign
  saveStatSnapshot_c_part_evo,
  saveStatSnapshot_c_help_evo

};
