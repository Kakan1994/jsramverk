// backend/models/codes.js
const fetch = require('node-fetch');

const codes = {
    getCodes: async (req, res, next) => {
        const query = `<REQUEST>
                  <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
                  <QUERY objecttype="ReasonCode" schemaversion="1">
                        <INCLUDE>Code</INCLUDE>
                        <INCLUDE>Level1Description</INCLUDE>
                        <INCLUDE>Level2Description</INCLUDE>
                        <INCLUDE>Level3Description</INCLUDE>
                  </QUERY>
            </REQUEST>`;

        try {
            const response = await fetch('https://api.trafikinfo.trafikverket.se/v2/data.json', {
                method: 'POST',
                body: query,
                headers: { 'Content-Type': 'text/xml' }
            });

            const result = await response.json();

            res.json({
                data: result.RESPONSE.RESULT[0].ReasonCode
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = codes;
