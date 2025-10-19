//Find userID from token for verification of email ID

import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.json({ success: false, message: "Not authorised. Login again" });
    }
    //console.log("here");
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id;
            //console.log(tokenDecode.id)
        } else {
            return res.json({ success: false, message: "Not authorised. Login again" });
        }

        next();

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export default userAuth;