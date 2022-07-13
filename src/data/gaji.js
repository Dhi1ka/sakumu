'use strict'
const db = require('./database').db
const date = require('date-and-time')

const getKaryawan = async function(callback) {
    // process fungsi buat tabel jika belum ada----------------------------------------
    let tablekaryawan = `CREATE TABLE IF NOT EXISTS "DATAKARYAWAN" ("id" INTEGER, "kj" INTEGER, "nama" TEXT)`
    let tablejabatan = `CREATE TABLE IF NOT EXISTS "JABATAN" ("kj" INTEGER, "namajabatan" TEXT, "besarangaji" INTEGER)`
    let tunjanganpotongan = `CREATE TABLE IF NOT EXISTS "TUNJANGANPOTONGAN" ("id" INTEGER, "jtp" INTEGER, "besaran" INTEGER)`
    let gaji = `CREATE TABLE IF NOT EXISTS "PENGGAJIAN" ("kd" INTEGER, "id" INTEGER, "timestamp" TEXT, "besaran" INTEGER)`
    db.prepare(tablekaryawan).run()
    db.prepare(tablejabatan).run()
    db.prepare(tunjanganpotongan).run()
    db.prepare(gaji).run()
    //end process---------------------------------------------------------------------- 
    
    // process ambil data karyawan
    let query = `SELECT id,d.kj,nama,namajabatan as jabatan
                    FROM DATAKARYAWAN d
                    INNER JOIN JABATAN j
                    ON d.kj = j.kj`
    let query1 = `SELECT kj,namajabatan,besarangaji
                    FROM JABATAN`
    try {
        const krows = db.prepare(query).all();
        const jrows = db.prepare(query1).all();
        // console.log(krows);
        return callback({krows, jrows})
    } catch (error) {
        console.log(error);
    }
    // end process
}

const getJabatan = async function(callback) {
    let query = `SELECT kj,namajabatan,besarangaji
                    FROM JABATAN`
    try {
        const jrows = db.prepare(query).all();
        return callback({jrows})
    } catch (error) {
        console.log(error);
    }
}

const addGuruKaryawan = async function(id, nama, jabatan, callback) {
    const cekid = `SELECT id FROM DATAKARYAWAN WHERE id=${id}`
    const query = `INSERT INTO DATAKARYAWAN (id,kj,nama) VALUES ('${id}','${jabatan}','${nama}')`
    const cek = db.prepare(cekid).all()
    console.log(cek.length);
    if (cek.length == 0) {
        try {
            const insert = db.prepare(query).run();
            if (insert.changes > 0) {
                callback({status: "ok"});
                // console.log('input berhasil');
            }
        } catch (error) {
            console.log('gagal');
        }
    }else{
        callback({status:'no', msg:'id sudah ada'})
        // console.log('input gagal');
    }
}

const updateKaryawan = async function(id, nama, jabatan, callback){
    // console.log(id, nama, jabatan);
    let queryupdate = `UPDATE DATAKARYAWAN SET kj="${jabatan}",nama="${nama}" WHERE id='${id}'`
    try {
        const krows = db.prepare(queryupdate).run();
        if (krows.changes > 0) {
            console.log('- data berhasil diperbaharui');
            return callback({status:'ok'})
        }else{
            return callback({status:'no'})
        }
    } catch (error) {
        // console.log(error);
    }
}

const getDataPenggajian = async function(callback) {
    const query = `SELECT * FROM PENGGAJIAN`

    try {
        const row = db.prepare(query).all()

        return callback({row})
    } catch (error) {
        console.error(error);
    }
}

const addDataGaji = async (kd, id, timestamp, nama, jabatan, gajikotor, ntpotongan, jtpotongan, totalpot, ntunjangan, jtunjangan, totaltunj, gjbersih, callback) => {

    // console.log('gaji kotor before = ', gajikotor)
    // console.log('gaji kotor after = ', parseInt(gajikotor.replace(/[.]/g, '')))
    // console.log(typeof gajikotor)
    // console.log('gaji bersih before = ', gjbersih)
    // console.log('gaji bersih after = ', parseInt(gjbersih))
    // console.log(typeof gjbersih)

    const addQuery = `INSERT INTO PENGGAJIAN (kd, id, timestamp, nama, jabatan, gajikotor, ntpotongan, jtpotongan, totalpot, ntunjangan, jtunjangan, totaltunj, gjbersih) VALUES ('${kd=Math.random().toString(16).slice(2)+new Date().getTime()}','${id=Math.random().toString(16).slice(2)+new Date().getTime()}','${timestamp}','${nama}','${jabatan}','${parseInt(gajikotor.replace(/[.]/g, ''))}','${ntpotongan}','${jtpotongan.map(pot => {
        const potRemoveDots = pot.replace(/[.]/g, '')
        const result = parseInt(potRemoveDots)

        return parseInt(result)
    })}','${totalpot}','${ntunjangan}','${jtunjangan.map(tunj => {
        const tunjRemoveDots = tunj.replace(/[.]/g, '')
        const result = parseInt(tunjRemoveDots)

        return parseInt(result)
    })}','${totaltunj}','${gjbersih}')`

    try {
        const insertDb = db.prepare(addQuery).run()

        if(insertDb.changes > 0) {
            callback({status:'created'})
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getKaryawan,
    getJabatan,
    addGuruKaryawan,
    updateKaryawan,
    getDataPenggajian,
    addDataGaji
}