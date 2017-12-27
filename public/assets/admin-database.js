// Global Variables
var rootRef = firebase.database().ref();
var db_obj;
var public_obj;
var private_obj;
var moderators_obj;

var members_private_table_data = [];
var members_public_table_data = [];
var companies_table_data = [];
var jobs_table_data = [];
var mod_table_data = [];

var map;
var gmap_obj;
var gmap_default_lat = 0;
var gmap_default_lng = 0;
var gmap_default_zoom = 1;

var members_private_table_headers = ["Name", "Email", "Approved", "Privacy", "Current Address",
  "Hometown Address", "LinkedIn Profile", "Industry", "Status", "Private UID", "Public UID", "Comments"];

var members_public_table_headers = ["Name", "LinkedIn Profile", "Current Address",
  "Hometown Address", "Industry", "Status", "Public UID"];

// Member JSON Object Template
var member_template = {
  first_name:"",
  last_name:"",
  email:"",
  ambassador:"",
  linkedin_profile:"",
  industry:"",
  comments:"",
  current_address: {
    lat:0,
    lng:0
  },
  hometown_address: {
    lat:0,
    lng:0
  },
  status:"",
  school:"",
  program:"",
  grad_year:"",
  interests : {
    connect:false,
    organize:false,
    learn:false,
    mentor:false,
    support:false
  },
  privacy:"",
  approved:"",
  date_created:"",
  public_uid:""
};

// -------------------------------------------------------------------------- //

// Load database values
function parseDatabase() {

  Object.keys(private_obj["members"]).forEach(function(key) {
    if (key != "dummy") {
      var mem = private_obj["members"][key];
      var name = mem["first_name"] + " " + mem["last_name"];
      var curr_loc = getLocationString(mem["current_address"]);
      var hometown = getLocationString(mem["hometown_address"]);
      var public_uid = "null";
      var linkedin_profile = "null";
      var comments = "null";
      if("linkedin_profile" in mem) {
        linkedin_profile = mem["linkedin_profile"];
      }
      if("comments" in mem) {
        comments = mem["comments"];
      }
      if("public_uid" in mem) {
        public_uid = mem["public_uid"];
      }
      members_private_table_data.push([name, mem["email"], mem["approved"], mem["privacy"], curr_loc, hometown, linkedin_profile,
        mem["industry"], mem["status"], key, public_uid, comments]);
    }
  });

  Object.keys(public_obj["members"]).forEach(function(key) {
    if (key != "dummy") {
      var mem = public_obj["members"][key];
      var name = mem["first_name"] + " " + mem["last_name"];
      var curr_loc = getLocationString(mem["current_address"]);
      var hometown = getLocationString(mem["hometown_address"]);
      members_public_table_data.push([name, mem["linkedin_profile"], curr_loc, hometown,
        mem["industry"], mem["status"], key]);
    }
  });

  Object.keys(moderators_obj).forEach(function(key) {
    if (key != "dummy") {
      var mem = private_obj["members"][key];
      var name = mem["first_name"] + " " + mem["last_name"];
      mod_table_data.push([name, mem["email"], key]);
    }
  });

  // Set gmap variables
  gmap_default_lat = public_obj["gmap"].default_lat;
  gmap_default_lng = public_obj["gmap"].default_lng;
  gmap_default_zoom = public_obj["gmap"].default_zoom;


}

// -------------------------------------------------------------------------- //

// Get Location String
function getLocationString(obj) {
  var loc = "";
  if("locality" in obj && obj["locality"] != "") {
    loc = obj["locality"];
  }
  if ("administrative_area_level_1" in obj && obj["administrative_area_level_1"] != "") {
    if (loc != "") {
      loc = loc + ", " + obj["administrative_area_level_1"];
    } else {
      loc = obj["administrative_area_level_1"];
    }
  }
  if ("country" in obj && obj["country"] != "") {
    if (loc != "") {
      loc = loc + ", " + obj["country"];
    } else {
      loc = obj["country"];
    }
  }
  return loc;
}

// Download database as JSON file
function exportDatabase() {

  dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db_obj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "GlobalNL_Database_" + Date.now() + ".json");
  downloadAnchorNode.click();
  downloadAnchorNode.remove();

}

// Moderator Database Functions

function moveFbRecord(oldRef, newRef) {
     oldRef.once('value', function(snap)  {
          newRef.set( snap.val(), function(error) {
               if( !error ) {  oldRef.remove(); }
               else if( typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
          });
     });
}

function copyFbRecord(oldRef, newRef) {
     oldRef.once('value', function(snap)  {
          newRef.set( snap.val(), function(error) {
               if( error && typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
          });
     });
}
