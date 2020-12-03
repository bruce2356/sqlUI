function insert1 (id, prize, dateNowShort, dateNowLong) {
    return `insert into PointRecord (UserID,PointType,Gold,Date, CreateDate)
    values (${id},'ElePredict', ${prize.gld}, '${dateNowShort}', '${dateNowLong}')`   
}

