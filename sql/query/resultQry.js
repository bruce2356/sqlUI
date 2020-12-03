const qry = {
    insPointRecord1: function insertPointRecord1 (params) {
                          return `insert into PointRecord (UserID,PointType,Gold,Date, CreateDate)
                              values (${params.id},'ElePredict', ${params.prize.gld}, '${params.dateNowShort}', '${params.dateNowLong}')`
                        },
    insPushInbox1:   function insertPushInbox1 (params) {
                          return `insert into PushInbox(UserID, PushMissionID, Title, Msg, Extra, Action, CreateDate, IsRead)
                              values (${params.id},888,'用電量預測結果','本期的用電量預測結果出爐囉！快來看看吧','{"subject":"用電量預測結果", "timestamp":${params.timestamp},"awardType":"${params.prize.name}","awardDesc":${params.prize.adc}, "predictionPower":${params.pdp},"actullyPower":${params.atp},"reducePower":${(params.pdp-params.atp)},"goldPoint":${params.prize.gld}}',10 ,'${params.dateNowLong}', 0)`
                        },
    updMember1:      function updateMember1 (params) {
                          return `update Member set GoldPoint = GoldPoint + ${params.prize.gld} where Mobile = '${params.mob}'`
                        },
    insPointRecord2: function insertPointRecord2 (params) {
                          return `insert into PointRecord (UserID,PointType,Sliver,Exp,Date, CreateDate)
                              values (${params.id},'GodsHand', ${params.slv}, ${params.exp}, '${params.dateNowShort}', '${params.dateNowLong}')`
                        },
    insPushInbox2:   function insertPushInbox2(params) {
                          return `insert into PushInbox(UserID, PushMissionID, Title, Msg, CreateDate, IsRead)
                          values (${params.id},999,'獎勵補發通知','您的獎勵已成功補發，內容為 經驗值:${params.exp} , 銀點:${params.slv}，祝您有個美好的一天，謝謝。','${params.dateNowLong}', 0)`
                        },
    updMember2:      function updateMember2(params) {
                          return `update Member set Exp = Exp + ${params.exp}, SilverPoint = SilverPoint + ${params.slv} where Mobile = '${params.mob}'`
                        }
  }
  
  module.exports = qry