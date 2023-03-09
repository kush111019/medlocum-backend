const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs');
const momentJs = require('moment');
const { extendMoment } = require('moment-range');
const config = require('../config/config');

const momentJsRange = extendMoment(momentJs);

const adminMessagesEn = require('../lang/en/adminMessage.json');
const webAppMessagesEn = require('../lang/en/webAppMessages.json');

// Email subject
const mailSubjectsEn = require('../lang/en/mailSubjects.json');

const Log = require('../models/logs.model');

const getWebAppMessages = (messageKey, lang = 'en') => {
  let apiMessagesSource;
  if (lang === 'en') {
    apiMessagesSource = webAppMessagesEn;
  } else if (lang === 'fr') {
    apiMessagesSource = webAppMessagesEn;
  } else {
    apiMessagesSource = webAppMessagesEn;
  }

  // split message key from DOT....
  // zero index represent source message object key
  // one index represent message key

  const messageKeyArr = messageKey.split('.');
  const sourceMessageObjKey = messageKeyArr[0];
  const tempMessageKey = messageKeyArr[1];

  if (tempMessageKey in apiMessagesSource[sourceMessageObjKey]) {
    return apiMessagesSource[sourceMessageObjKey][tempMessageKey];
  }
  return 'No appropriate message found for api.';
};

const getAdminMessages = (messageKey, lang = 'en') => {
  let apiMessagesSource;
  if (lang === 'en') {
    apiMessagesSource = adminMessagesEn;
  } else if (lang === 'fr') {
    apiMessagesSource = adminMessagesEn;
  } else {
    apiMessagesSource = adminMessagesEn;
  }

  // split message key from DOT....
  // zero index represent source message object key
  // one index represent message key

  const messageKeyArr = messageKey.split('.');
  const sourceMessageObjKey = messageKeyArr[0];
  const tempMessageKey = messageKeyArr[1];

  if (tempMessageKey in apiMessagesSource[sourceMessageObjKey]) {
    return apiMessagesSource[sourceMessageObjKey][tempMessageKey];
  }
  return 'No appropriate message found for api.';
};

const getMailSubject = (subjectKey, lang = 'en') => {
  let mailSubjectSource;
  if (lang === 'en') {
    mailSubjectSource = mailSubjectsEn;
  } else if (lang === 'fr') {
    mailSubjectSource = mailSubjectsEn;
  } else {
    mailSubjectSource = mailSubjectsEn;
  }

  // split message key from DOT....
  // zero index represent source message object key
  // one index represent message key

  const messageKeyArr = subjectKey.split('.');
  const sourceMessageObjKey = messageKeyArr[0];
  const tempSubjectKey = messageKeyArr[1];

  if (tempSubjectKey in mailSubjectSource[sourceMessageObjKey]) {
    return mailSubjectSource[sourceMessageObjKey][tempSubjectKey];
  }

  return 'No appropriate subject found for this email.';
};

const logResponse = async ({ req, data, message, status, statusCode = 200 }) => {
  const startTime = +req._startTime;
  const endTime = +new Date();

  const ip =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  const objLog = new Log({
    uri: req.originalUrl,
    headers: req.headers,
    method: req.method,
    params: req.body,
    ip_address: ip,
    start_time: startTime,
    end_time: endTime,
    rtime: endTime - startTime,
    status: statusCode,
    response: { data, message, code: statusCode, status },
  });

  await objLog.save();
};

const logData = (data, reqFileName = '') => {
  const _GMTDate = momentJs.utc().format('YYYY-MM-DD');

  let fileName = reqFileName;
  if (!fileName) {
    fileName = _GMTDate;
    fileName += '.txt';
  }
  fs.appendFile(`logs/${fileName}`, `\n\n${new Date()}\n\n${data}`, function (err) {
    if (err) throw err;
    // console.log('Saved!');
  });
};

const setResponse = (addDataKey = 0) => {
  const response = {
    code: 400,
    status: false,
    isShowMessage: false,
    message: getAdminMessages('commonMessage.invalidRequest'),
  };
  if (addDataKey) {
    response.data = {};
  }
  return response;
};

const verifyCaptchaToken = async (token) => {
  try {
    if (!token) {
      return false;
    }
    const payload = {
      secret: config.captchaServerKey,
      response: token,
    };
    const body = querystring.stringify(payload);

    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response && response.data && response.data.success ? response.data.success : false;
  } catch (error) {
    // console.log('-> captcha verification error.message', error.message);
    // console.log('-> captcha verification error.response', error.response);
    return false;
  }
};

const getCurrentYear = () => {
  const d = new Date();
  const year = d.getFullYear();
  return year;
};

// get date range from selected date
const getDateRange = (start, end, format = 'YYYY-MM-DD', step = 1, rangeBy = 'days', sendRangeObj = 0) => {
  const fromDate = momentJsRange(start);
  const toDate = momentJsRange(end);

  const range = momentJsRange().range(fromDate, toDate);

  const rangeData = range.by(rangeBy, { step });

  if (sendRangeObj) {
    return rangeData;
  }

  const rangeDates = Array.from(rangeData).map((row) => row.format(format));

  return rangeDates;
};

// get date difference in minutes,hours and days
const getDateDiffInMinutsHoursDays = (startDateTime, endDateTime) => {
  const respObj = {
    hours: 0,
    minutes: 0,
  };
  const startTime = momentJs(startDateTime);
  const endTime = momentJs(endDateTime);
  const duration = momentJs.duration(endTime.diff(startTime));

  //   const hours = parseInt(duration.asHours());
  //   const minutes = parseInt(duration.asMinutes()) / 60;

  const hours = duration.asHours();
  const minutes = duration.asMinutes() / 60;

  respObj.days = duration.asDays();
  respObj.hours = hours;
  respObj.minutes = minutes;

  return respObj;
};

// get current  date string with zero hour, min, sec and millisecond
const getCurrentDateIsoStringWithZeroHourMinSecMilliSecond = () => {
  const tempDate = momentJs().utcOffset(0);
  const dt = tempDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString();
  return dt;
};

module.exports = {
  getWebAppMessages,
  getAdminMessages,
  getMailSubject,
  logResponse,
  logData,
  setResponse,
  verifyCaptchaToken,
  getCurrentYear,
  getDateRange,
  getDateDiffInMinutsHoursDays,
  getCurrentDateIsoStringWithZeroHourMinSecMilliSecond,
};
