import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { config } from '../config';
import User from '../models/User';

// JWT Strategy for token-based authentication
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secret,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        
        if (!user || !user.isActive) {
          return done(null, false);
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
