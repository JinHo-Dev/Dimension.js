// reference size
const circle_radius = 100;
const rect_length = 312;
const max_error_rate = 0.2;
const interval_time = 33;

// get DOM object
const vid = document.querySelector("video");
const cvs = document.querySelector("canvas");
const ctx = cvs.getContext("2d");

// Width, Height of Video/Canvas
let W = 600;
let H = 400;

// Distance, Radius, Focus, theta
let D = 530;
let R = 0.7;
let F = 100;
let theta = 0;
// if "F" fixed
let fixed_F = 1000;

// pre calc
let sinR, cosR, tanR, itanR, DsinR, DcosR;
