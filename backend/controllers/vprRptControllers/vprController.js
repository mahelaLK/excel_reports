const { getAllVprDetail } = require('../../model/vprRptModels/vprModel.js');

async function fetchVprDetail(req, res) {
    try {
        const inwardVoyage = req.params.inwardVoyage;
        const details = await getAllVprDetail(inwardVoyage);
        res.json({success: true, details});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

module.exports = { fetchVprDetail }