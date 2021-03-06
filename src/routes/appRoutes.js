'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');

//controllers
const mainControll = require('../controllers/mainController');
const appControll = require('../controllers/appController');
const outController = require('../controllers/outController');
const apicontroller = require('../controllers/apicontroller');

//GET
router.get('/', mainControll.getRoot);
router.get('/aktivasi', mainControll.getAktivasi);
// router.get('/aktivasi/cektoken', mainControll.cektoken);
router.get('/login', mainControll.getLogin);
router.get('/dashboard', mainControll.getDashboard);
router.get('/profile', mainControll.getProfile);
router.get('/kas',mainControll.getKas);
router.get("/gj/datakaryawan", outController.getGuruKaryawan)
router.get("/gj/jabatan", outController.getJabatan)
router.get("/gj/penggajian", outController.getPenggajian)
router.get("/gj/laporan", outController.getLaporan)
router.post("/gj/addkaryawan", outController.postGuruKaryawan);
router.post("/gj/editkaryawan", outController.updateKaryawan)
// get kas bank
router.get('/aruskas', mainControll.getArusKas);
router.get('/aruskastanggal', mainControll.getArusKasTanggal);
router.get('/cekSinkronisasi', mainControll.cekSinkron);
router.get('/cetaklaporan', mainControll.cetakLaporan);
router.get('/cetakkwitansi', mainControll.getCetakKwitansi);
router.get('/logout', mainControll.getLogout);
router.get('/settings', appControll.getSetting);
router.get('/settings/akun', appControll.getSetAkun);
router.get('/settings/kas', appControll.getSetKas);
router.get('/settings/menu', appControll.getSetMenu);
router.get('/settings/backup', appControll.getSetBackup);
router.get('/settings/backupdb', appControll.backup);
router.get('/settings/siswa', appControll.getSetSiswa);
router.get('/app/sync', mainControll.getSync);
router.get('/settings/editkelas', appControll.getEditKelas);
router.get('/settings/profile', appControll.getSetProfile);
router.get(`/simpel`, mainControll.getSimpel)

//POST
router.post('/aktivasi', mainControll.postAktivasi);
router.post('/login', mainControll.postLogin);
router.post('/settings/addkas', appControll.postAddKas);
router.post('/settings/delkas', appControll.postDelKas);
router.post('/settings/editkas', appControll.postEditKas);
router.post('/settings/addmenu', appControll.addNewMenu);
router.post('/settings/delmenu', appControll.delMenu);
router.post('/settings/editmenu', appControll.editMenu);
router.post('/settings/addsumberdana', appControll.addNewDana);
router.post('/settings/delsumberdana', appControll.delDana);
router.post('/settings/addkelas', appControll.addNewKelas);
router.post('/settings/editkelas', appControll.postEditKelas);
router.post('/settings/delete/kelas', appControll.postDeleteKelas);
router.post('/settings/addsiswa', appControll.addDataSiswa);
router.post('/settings/delsiswa/all', appControll.delAllSiswa);
router.post('/settings/delsiswa', appControll.delSelectedSiswa);
router.post('/settings/editsiswa', appControll.editSelectedSiswa);
router.post('/settings/profile', appControll.postProfile);
router.get('/siswa/:kelas', appControll.getListSiswa);
router.post(`/gj/penggajian`, outController.postPenggajian)
// router.get('/printkwitansi', appControll.printkwitansi)
// router.post('/settings/backupdb', appControll.backup);

// API
// get
router.get('/aruskas/API', mainControll.getlaporanjson);
router.get('/API/settings/menu', appControll.getSetMenuAPI);
router.get('/API/settings/kas', appControll.getSetKasApi);
// router.get('/API/settings/sumberdana', appControll.getSetDanaAPI);
router.get('/API/settings/editkelas', appControll.getSetKelasApi);
router.get('/API/aruskas', apicontroller.getKasApi);
router.get('/API/penerimaan/', apicontroller.APIInNoMenu);
router.get('/API/penerimaan/:no', apicontroller.APIgetpenerimaan);
router.get('/API/penerimaan/all/:no', apicontroller.APIgetpenerimaanall);
router.get('/API/penerimaan/:no/search', apicontroller.APIGetSearch)
// post
router.post('/API/penerimaan/:no', apicontroller.APIinsearch);


//----------------------------------------------------------------------------------------------------------------//
//multer setting
//setting upload
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
	   cb(null,'uploads')
	},
	filename: (req, file, cb) => {
	   cb(null, `formFileTemplate.xlsx`)
	}
});
//upload
const upload = multer({storage : storage});
//endpoint
router.post('/settings/editkelas/upload', upload.single('formFileTemplate'), appControll.uploadTemplate);
// --------------------------------------------------------------------------------------------------------------//



// --------------------------------------------------------------------------------------------------------------//
const memo = multer.diskStorage({
	destination: (req, file, cb) =>{
		cb(null, 'img')
	},
	filename: (req, file, cb) => {
		cb(null, `kopsurat.PNG`)
	}
});
//uploads kopsurat
const unggah = multer({storage : memo})
router.post('/settings/kas/upload', unggah.single('image'), appControll.uploadKop);
// --------------------------------------------------------------------------------------------------------------//




// -------------------------------------------------------------------------------------------------------------//
const bckupdb = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'db')
	},
	filename: (req, file, cb) => {
		cb(null, `database.db`)
	}
});
// upload database
const restore = multer({storage: bckupdb})
router.post('/settings/backup/restore', restore.single('database'), appControll.restoreDB);

// ------------------------------------------------------------------------------------------------------------//



// ------------------------------------------------------------------------------------------------------------//
const uplogo = multer.diskStorage({
	destination: (req, file,  cb) => {
		cb(null, 'img/logo')
	},
	filename: (req, file, cb) => {
		cb(null, `logo.png`)
	}
});
// upload database
const uplog = multer({storage: uplogo})
router.post('/settings/upload/logo', uplog.single('uploadlogo'), appControll.uploadlogo)
// ------------------------------------------------------------------------------------------------------------//

module.exports = {
    routes: router
}