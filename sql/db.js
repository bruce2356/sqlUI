const mssql = require("mssql");
const util = require("util");
const conf = require("./config.js");

let restoreDefaults = function () {conf;};
const con = new mssql.ConnectionPool(conf);

con.on('error', err => {if(err){throw err;}});

con.connect(err => {if (err){console.error(err);}});

let querySql = async function (sql, params, callBack) {
    try{
        let ps = new mssql.PreparedStatement(con);
        if(params !="") {
            for (var index in params) {
                if(typeof params[index] == "number"){
                    ps.input(index, mssql.Int);
                }else if (typeof params[index] == "string"){
                    ps.input(index, mssql.NVarChar);
                }
            }
        }
        ps.prepare(sql, err =>{
            if(err)
                console.log(err);
            ps.execute(params, (err, recordset) =>{
                callBack(err, recordset);
                ps.unprepare(err => {
                    if(err)
                        console.log(err);
                });
            });
        });
    }catch(err){console.error('SQL error', err);}
    restoreDefaults();
};

var select = async function (tableName, topNumber, whereSql, params, orderSql, callBack) {
    try{
        var ps = new mssql.PreparedStatement(con);
        var sql = "select Mobile, Exp, SilverPoint, GlodPoint from "+ tableName + " ";
        if(topNumber !=""){
            sql = "select top(" + topNumber + ") * from " + tableName + " ";
        }
        sql +=whereSql + " ";
        if (params != "") {
            for (var index in params) {
                if(typeof params[index] == "number") {
                    ps.input(index, mssql.Int);
                }else if (typeof params[index] == "string") {
                    ps.input(index, mssql.NVarChar);
                }
            }
        }
        sql += orderSql;
        console.log(sql);
        ps.prepare(sql, err => {
            if(err)
                console.log(err);
            ps.execute(params, (err, recordset) =>{
                callBack(err, recordset);
                ps.unprepare(err =>{
                    if (err)
                        console.log(err);
                });
            });
        });
    }catch(err){ console.error('SQL erroe', err);}
    restoreDefaults();
};

var update = async function (updateObj, whereObj, tableName, callBack) {
    try{
        var ps = new mssql.PreparedStatement(con);
        var sql = "update " + tableName + " set ";
        if (updateObj != "") {
            for (var index in updaeObj) {
                if (typeof updateObj[index] == "number") {
                    ps.input(index, mssql.Int);
                    sql += index + "=" + index + updateObj[index] +",";
                }else if (typeof updateObj[index] == "string") {
                    ps.input(index, mssql.NVarChar);
                    sql += index + "=" + "'" + updaeObj[index] + "'" + ",";
                }
            }
        }
        sql = sql.substring(0, sql.length -1) + " where ";
        if (whereObj != "") {
            for (var index in whereObj) {
                if (typeof whereObj[index] == "number") {
                    ps.input(index, mssql.int);
                    sql += index + "=" + whereObj[index] + " and ";
                }else if (typeof whereObj[index] == "string") {
                    ps.input(index, mssql.NVarChar);
                    sql += index + "=" + "'" + " and ";
                }
            }
        }
        sql = sql.substring(0, sql.length - 5);
        ps.prepare(sql, err => {
            if (err)
                console.log(err);
            ps.execute(updaeObj, (err, recordset) => {
                callBack(err, recordset);
                ps.unprepare(err => {
                    if(err)
                        console.log(err);
                });
            });
        });
    }catch(err){
        console.error('SQL error', err);
    }
    restoreDefaults();
};

exports.config = conf;
exports.select = select;
exports.update = update;
exports.querySql = querySql;
exports.restoreDefaults = restoreDefaults;
