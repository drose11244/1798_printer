import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import './Helpers.js';

Router.route('/', function () {
  this.render('hello');
});
