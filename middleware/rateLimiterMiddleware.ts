import { NextFunction, Request, Response } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

//Daily rate limiter of 600 requests
const dailyRateLimiter = new RateLimiterMemory({
  points: 600,
  duration: 24 * 60 * 60,
});

//Get request hourly rate limiter of 60 requests
const getRateLimiter = new RateLimiterMemory({
  points: 60,
  duration: 60 * 60,
});

//POST request hourly rate limiter of 10 requests
const postRateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60 * 60,
});

export const checkGetRequestLimit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  dailyRateLimiter
    .consume(req.ip)
    .then(() => {
      getRateLimiter
        .consume(req.ip)
        .then(() => {
          next();
        })
        .catch(() => {
          res
            .status(429)
            .send("Too Many GET Requests: maximum of 60 requests/hour");
        });
    })
    .catch(() => {
      res.status(429).send("Too Many Requests: maximum of 600 requests/day");
    });
};

export const checkPostRequestLimit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  dailyRateLimiter
    .consume(req.ip)
    .then(() => {
      postRateLimiter
        .consume(req.ip)
        .then(() => {
          next();
        })
        .catch(() => {
          res
            .status(429)
            .send("Too Many POST Requests: maximum of 10 requests/hour.");
        });
    })
    .catch(() => {
      res.status(429).send("Too Many Requests: maximum of 600 requests/day");
    });
};
