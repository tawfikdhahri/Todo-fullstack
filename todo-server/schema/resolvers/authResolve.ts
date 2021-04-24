export const authResolve = (user, cb) => {
  if (!user) {
    return Promise.reject("You are not authenticated");
  } else {
    return cb();
  }
};
