/*jslint node: true */
'use strict';

module.exports = function validString (s) {
  if ('string' != typeof s) {
    s = '';
  }
  return s.trim();
};
