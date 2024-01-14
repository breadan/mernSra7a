import validator from "validator";

const rules = {
  nameNotEmpty: (req, res, next) => {
    const name = req.body.name;
    if (!name || name.trim().length < 3 || name.trim().length > 15) {
      next({
        name: "validation Error",
        element: "name : name",
        message: "Name is required. The name length must be between 3 and 10 characters.",
      });
    } else {
      next();
    }
  },

  names: (req, res, next) => {
    const name = req.body.name;
    const specialCharacters = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (specialCharacters.test(name)) {
      next({
        name: "validation Error",
        element: "name : name",
        message: "Name should not contain special characters.",
      });
    } else {
      next();
    }
  },

  emailValidator: (req, res, next) => {
    const email = req.body.email;
    if (!email) {
      next({
        name: "validation Error",
        element: "email : email",
        message: "Email is required.",
      });
    } else if (!validator.isEmail(email)) {
      next({
        name: "validation Error",
        element: "email : email",
        message: "Email is not valid.",
      });
    } else {
      next();
    }
  },

  validatePass: (req, res, next) => {
    const password = req.body.password;
    if (!password ||password.length < 3 || password.length > 12 ) {
      next({
        name: "validation Error",
        element: "password : password",
        message: "Password is required & Password must be between 3 and 12 characters",
      });
    } else {
      next();
    }
  },

  validateAge: (req, res, next) => {
    const age = req.body.age;
    if (!age || age < 5 || age > 100) {
      next({
        name: "validation Error",
        element: "age : age",
        message: "Age is required & Age must be between 5 and 100.",
      });
    } else {
      next();
    }
  },
};

const validate = {
  signUp: [rules.nameNotEmpty, rules.names, rules.emailValidator, rules.validatePass, rules.validateAge],
};

export default validate;
