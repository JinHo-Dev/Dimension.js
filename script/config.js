// measure DRF or not
let DRF_measure = true;

// reference size
const circle_radius = 100;
const rect_length = 312;
const max_error_rate = 0.2;
const interval_time = 100; // 10fps

// get DOM object
const vid = document.querySelector("video");
const cvs = document.querySelector("canvas");
const ctx = cvs.getContext("2d");

// Width, Height of Video/Canvas
let W;
let H;

// Distance, Radius, Focus, theta
let D = 2000;
let R = 0.7;
let F = 1000;
let theta = 0;
// if "F" fixed
let fixed_F = 0;
// iphone 13mini => 750
// macbook pro 14' => 1200

// pre calc
let sinR, cosR, tanR, itanR, DsinR, DcosR;
