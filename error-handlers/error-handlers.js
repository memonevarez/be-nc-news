//23502:not_null_violation
//23503: foreign_key_violation - Key (author)=(Guillermo) is not present in table "users"
//22P02: invalid_text_representation - not-a-number cases
exports.psqlErrorHandler = (err, request, response, next) => {
  if (err.code === "23502" || err.code === "22P02" || err.code === "23503") {
    response.status(400).send({ msg: "Bad request" });
  }
  next(err);
};

exports.customErrorHandler = (err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

// General error handler for unexpected errors
exports.serverErrorHandler = (err, request, response, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
