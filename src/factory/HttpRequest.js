'use strict';
const OpdData = function (domain,variable, UnitId, SessionID) {
    return new Promise(async (resolve, reject) => {
        try {
            var axios = require('axios');
            const {ResponseHandler} = require('@rahadiana/node_response_standard');
            const VariablePath = ["dinas", "unit", "subunit"]

            const FinalVariablePath = VariablePath.find(
                element => element === variable.toLowerCase()
            );

            if (FinalVariablePath === undefined) {
                return resolve(ResponseHandler(404, "", "avail methotd : " + VariablePath))
            } else {

                let BuildUrl = FinalVariablePath;
                let FinalUrlRequest;
                let BaseUrl = `https://${domain}.bekasikota.go.id/`;

                switch (BuildUrl) {
                    case "unit":
                        FinalUrlRequest = BaseUrl + 'data/combo_unit?_id=unit&_name=unit&_value=' +
                                UnitId;
                        break;
                    case "subunit":
                        FinalUrlRequest = BaseUrl +
                                'data/combo_unit?_id=subunit&_name=subunit&_value=' + UnitId;
                        break;
                    case "dinas":
                        FinalUrlRequest = BaseUrl +
                                'data/combo_unit?_id=subunit&_name=subunit&_value=' + UnitId;
                        break;
                    default:
                        FinalUrlRequest = "latau"
                }

                function isValidJson(json) {
                    const JsonParse = JSON.stringify(json)
                    try {
                        JSON.parse(JsonParse);
                        return json;
                    } catch (e) {
                        return "invalid json";
                    }
                }

                var config = {
                    method: 'get',
                    url: `${FinalUrlRequest}`,
                    headers: {
                        'Cookie': `ci_session=${SessionID}`
                    }
                };

                axios(config)
                    .then(function (response) {

                        const MsgStatus = isValidJson(response.data) == "" || isValidJson(
                            response.data
                        ) == "[]"
                            ? ResponseHandler(
                                404,
                                isValidJson(response.data),
                                "Gagal Ambil Data, ID tidak ditemukan"
                            )
                            : ResponseHandler(
                                response.status,
                                isValidJson(response.data),
                                "Berhasil Ambil Data"
                            )

                        return resolve(MsgStatus)
                    })
                    .catch(function (error) {

                        const ErrStatus = error.response.status === 404
                            ? error.response.status
                            : error.response.data

                        return resolve(
                            ResponseHandler(error.response.status, isValidJson(ErrStatus), "Gagal Ambil Data")
                        )
                    });
            }

        } catch (e) {
            return reject(e);
        }
    })
}

module.exports = {
    OpdData
}
