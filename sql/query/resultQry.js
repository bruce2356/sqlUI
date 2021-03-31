const qry = {
  getGold: 
    function getGold (params) {
      return `BEGIN TRANSACTION DECLARE @insPR int,@insPI int ,@upM int ,@R int
          insert into PointRecord (UserID,PointType,Gold,Date, CreateDate)
          values (${params.id},'ElePredict', ${params.prize.gld}, '${params.dateNowShort}', '${params.dateNowLong}')
          select @insPR = @@ERROR
          insert into PushInbox(UserID, PushMissionID, Title, Msg, Extra, Action, CreateDate, IsRead)
          values (${params.id},888,'用電量預測結果','本期的用電量預測結果出爐囉！快來看看吧','{"subject":"用電量預測結果", "timestamp":${params.timestamp},"awardType":"${params.prize.name}","awardDesc":${params.prize.adc}, "predictionPower":${params.pdp},"actullyPower":${params.atp},"reducePower":${(params.pdp-params.atp)},"goldPoint":${params.prize.gld}}',10 ,'${params.dateNowLong}', 0)
          select @insPI = @@ERROR
          update Member set GoldPoint = GoldPoint + ${params.prize.gld} where Mobile = '${params.mob}'
          select @upM = @@ERROR
          select @R = @@ROWCOUNT
          if @insPR = 0 and @insPI = 0 and @upM = 0 and @R = 1 commit transaction
          else rollback transaction`
    },
  GodsHand: 
    function GodsHand (params) {
      return `BEGIN TRANSACTION DECLARE @insPR int,@insPI int ,@upM int ,@R int
          insert into PointRecord (UserID,PointType,Sliver,Exp,Date, CreateDate)
          values (${params.id},'GodsHand', ${params.slv}, ${params.exp}, '${params.dateNowShort}', '${params.dateNowLong}')
          select @insPR = @@ERROR
          insert into PushInbox(UserID, PushMissionID, Title, Msg, CreateDate, IsRead)
          values (${params.id},999,'獎勵發送通知','您的獎勵已成功發送，內容為 經驗值:${params.exp} , 銀點:${params.slv}，祝您有個美好的一天，謝謝。','${params.dateNowLong}', 0)
          select @insPI = @@ERROR
          update Member set Exp = Exp + ${params.exp}, SilverPoint = SilverPoint + ${params.slv} where Mobile = '${params.mob}'
          select @upM = @@ERROR
          select @R = @@ROWCOUNT
          if @insPR = 0 and @insPI = 0 and @upM = 0 and @R = 1 commit transaction
          else rollback transaction`
    },
  apigold:
    function apigold (params) {
      return `BEGIN TRANSACTION DECLARE @insPR int,@insPI int ,@upM int ,@R int
      insert into PointRecord (UserID,PointType,Gold,Date, CreateDate)
      values ((select ID from Member where Mobile='${params.mob}'),'ElePredict', ${params.prize.gld}, '${params.dateNowShort}', '${params.dateNowLong}')
      select @insPR = @@ERROR
      insert into PushInbox(UserID, PushMissionID, Title, Msg, Extra, Action, CreateDate, IsRead)
      values ((select ID from Member where Mobile='${params.mob}'),888,'用電量預測結果','本期的用電量預測結果出爐囉！快來看看吧','{"subject":"用電量預測結果", "timestamp":${params.timestamp},"awardType":"${params.prize.name}","awardDesc":${params.prize.adc}, "predictionPower":${params.pdp},"actullyPower":${params.atp},"reducePower":${(params.pdp-params.atp)},"goldPoint":${params.prize.gld}}',10 ,'${params.dateNowLong}', 0)
      select @insPI = @@ERROR
      update Member set GoldPoint = GoldPoint + ${params.prize.gld} where Mobile = '${params.mob}'
      select @upM = @@ERROR
      select @R = @@ROWCOUNT
      if @insPR = 0 and @insPI = 0 and @upM = 0 and @R = 1 commit transaction
      else rollback transaction`
    },
    multi: 
    function multi (params) {
      return `BEGIN TRANSACTION DECLARE @insPR int,@insPI int ,@upM int ,@insPR1 int,@insPI1 int ,@upM1 int ,@R int
          insert into PointRecord (UserID,PointType,Gold,Date, CreateDate)
          values ((select ID from Member where Mobile='${params.mob}'),'ElePredict', ${params.prize.gld}, '${params.dateNowShort}', '${params.dateNowLong}')
          select @insPR = @@ERROR
          insert into PushInbox(UserID, PushMissionID, Title, Msg, Extra, Action, CreateDate, IsRead)
          values ((select ID from Member where Mobile='${params.mob}'),888,'用電量預測結果','本期的用電量預測結果出爐囉！快來看看吧','{"subject":"用電量預測結果", "timestamp":${params.timestamp},"awardType":"${params.prize.name}","awardDesc":${params.prize.adc}, "predictionPower":${params.pdp},"actullyPower":${params.atp},"reducePower":${(params.pdp-params.atp)},"goldPoint":${params.prize.gld}}',10 ,'${params.dateNowLong}', 0)
          select @insPI = @@ERROR
          update Member set GoldPoint = GoldPoint + ${params.prize.gld} where Mobile = '${params.mob}'
          select @upM = @@ERROR
          insert into PointRecord (UserID,PointType,Sliver,Exp,Date, CreateDate)
          values ((select ID from Member where Mobile='${params.mob}'),'GodsHand', ${params.slv}, ${params.exp}, '${params.dateNowShort}', '${params.dateNowLong}')
          select @insPR1 = @@ERROR
          insert into PushInbox(UserID, PushMissionID, Title, Msg, CreateDate, IsRead)
          values ((select ID from Member where Mobile='${params.mob}'),999,'獎勵發送通知','您的獎勵已成功發送，內容為 經驗值:${params.exp} , 銀點:${params.slv}，祝您有個美好的一天，謝謝。','${params.dateNowLong}', 0)
          select @insPI1 = @@ERROR
          update Member set Exp = Exp + ${params.exp}, SilverPoint = SilverPoint + ${params.slv} where Mobile = '${params.mob}'
          select @upM1 = @@ERROR
          select @R = @@ROWCOUNT
          if @insPR = 0 and @insPI = 0 and @upM = 0 and @insPR1 = 0 and @insPI1 = 0 and @upM1 = 0 and @R = 1 commit transaction
          else rollback transaction`
    }
}
module.exports = qry