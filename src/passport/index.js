import { encrypt, decrypt, secret } from '../utils/crypto'
import passport from 'passport'
import passportJWT from 'passport-jwt'
import User from '../models/user'

const extractJwt = passportJWT.ExtractJwt
const jwtStrategy = passportJWT.Strategy

passport.use(new jwtStrategy({
    jwtFromRequest: extractJwt.fromAuthHeader(),
    secretOrKey : secret
}, (data, next) => {
    var payload = JSON.parse(decrypt(data))

    var username = payload.username,
        password = payload.password

    return new Promise((resolve, reject) => {
        User.findOne({
            username
        }, (error, user) => {
            if (error) return reject(next(error))
    
            if (!user) return reject(next(null, false))
    
            user.comparePassword(password, function(e, isMatch) {
                if (e) return reject(next(e))
    
                if (!isMatch) return reject(next(null, false))
    
                return resolve(next(null, user))
            });
        })
    })
}))

export default passport