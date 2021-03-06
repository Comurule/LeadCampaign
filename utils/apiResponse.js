exports.error_res = (res, err) => {
    res.status(err.status || 400)
        .json({
            status:false,
            Error: err.name,
            message: err.message
        })
};

exports.error_res_with_msg = (res, msg) => {
    res.status(400)
        .json({
            status:false,
            message: msg
        })
};

exports.success_res = (res, msg) => {
    res.status(200)
        .json({
            status: true,
            message: msg
        })
};

exports.success_res_with_data = (res, msg, data) => {
    res.status(200)
        .json({
            status:true,
            message: msg,
            data: data
        })
}