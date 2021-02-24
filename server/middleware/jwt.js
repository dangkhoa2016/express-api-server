const { JwtService } = require("../services");

class JwtMiddleware {
  constructor() { }

  get_token(req) {
    const bearer = req.header("Authorization") || "";
    var token = bearer.split(" ")[1];
    if (!token) token = req.cookies.auth_token;

    return token;
  }

  verify() {
    var t = this;

    return (req, res, next) => {
      var token = t.get_token(req);
      const valid = JwtService.verify(token);

      var err = null;
      if (valid) {
        req.credential = JwtService.get_payload(token);
        res.locals.user = req.credential.user;
      } else {
        req.error_code = 300;
        err = new Error("Invalid token");
      }

      // console.log('res.locals.user', res.locals.user, req.credential);
      next(err);
    };
  }

  hasRole(role, return_value) {
    var t = this;

    return (req, res, next) => {
      var user = req.credential;
      var err = null;

      if (!user) {
        var token = t.get_token(req);

        const decoded = JwtService.decode(token);
        if (decoded) user = decoded.payload;
      }

      if (!user) {
        err = new Error("Access Denied");
        if (return_value)
          return false;
        else
          return next(err);
      }

      var is_allow = user.roles.find(e => e.role === role);

      if (!is_allow) err = new Error("Access Denied");
      if (return_value)
        return is_allow;
      else
        return next(err);
    };
  }

  hasAllRoles(roles) {
    var t = this;

    return (req, res, next) => {
      var user = req.credential;
      var err = null;

      if (!user) {
        var token = t.get_token(req);

        const decoded = JwtService.decode(token);
        if (decoded) user = decoded.payload;
      }

      if (!user) {
        err = new Error("Access Denied");
        return next(err);
      }

      var is_allow = roles.every(e => user.roles.find(i => i.role === e));

      if (!is_allow) err = new Error("Access Denied");

      return next(err);
    };
  }

  hasAnyRole(roles) {
    var t = this;

    return (req, res, next) => {
      var user = req.credential;
      // console.log('hasAnyRole', user);
      var err = null;

      if (!user) {
        var token = t.get_token(req);

        const decoded = JwtService.decode(token);
        // console.log('decoded', decoded);
        if (decoded) user = decoded.payload;
      }

      if (!user) {
        err = new Error("Access Denied");
        return next(err);
      }

      var is_allow = roles.some(e => user.roles.find(i => i.role === e));

      if (!is_allow) err = new Error("Access Denied");

      return next(err);
    };
  }
}

module.exports = new JwtMiddleware();
