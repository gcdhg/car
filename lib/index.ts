//libs
import * as createError from "http-errors";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
//db
import sequelize from "./db/init";
//routers
import orderRouter from "./routes/order.routes";

import config = require("../config.js");

const app = express();

const sequelizeAll = sequelize(config);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/order/", orderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req: express.Request, res: express.Response, next: express.NextFunction) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

sequelizeAll
    .authenticate()
    .then(() => console.log("Connect success"))
    .catch((e) => {
        console.log("No connect");
        process.exit(1);
    });

app.listen(3000, () => "HI");

export default app;
