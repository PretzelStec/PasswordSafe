module.exports = (err, req, res, next) => {
    return res.status(400).json({
        status: "failed",
        error:err
    })
}