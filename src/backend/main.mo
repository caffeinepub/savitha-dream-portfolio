import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";


actor {
  include MixinStorage();

  type Project = {
    id : Nat;
    title : Text;
    description : Text;
    link : Text;
  };

  type ProjectInput = {
    title : Text;
    description : Text;
    link : Text;
  };

  type Profile = {
    photoURL : Text;
    about : Text;
    instagram : Text;
    linkedin : Text;
    phone : Text;
  };

  type Resume = {
    name : Text;
    data : Storage.ExternalBlob;
  };

  type Visitor = {
    username : Text;
    date : Text;
  };

  var nextProjectId = 0;

  let projects = Map.empty<Nat, Project>();
  let visitors = Map.empty<Nat, Visitor>();

  var profile : ?Profile = null;
  var resume : ?Resume = null;

  // Visitor Log
  public shared ({ caller }) func recordVisitor(username : Text, date : Text) : async () {
    let id = visitors.size();
    let visitor : Visitor = {
      username;
      date;
    };
    visitors.add(id, visitor);
  };

  public query ({ caller }) func getVisitors() : async [Visitor] {
    visitors.values().toArray();
  };

  // Profile
  public shared ({ caller }) func saveProfile(photoURL : Text, about : Text, instagram : Text, linkedin : Text, phone : Text) : async () {
    let newProfile : Profile = {
      photoURL;
      about;
      instagram;
      linkedin;
      phone;
    };
    profile := ?newProfile;
  };

  public query ({ caller }) func getProfile() : async ?Profile {
    profile;
  };

  // Resume
  public shared ({ caller }) func saveResume(name : Text, data : Storage.ExternalBlob) : async () {
    let newResume : Resume = {
      name;
      data;
    };
    resume := ?newResume;
  };

  public query ({ caller }) func getResume() : async ?Resume {
    resume;
  };

  // Projects
  public shared ({ caller }) func addProject(project : ProjectInput) : async () {
    let newProject : Project = {
      id = nextProjectId;
      title = project.title;
      description = project.description;
      link = project.link;
    };
    projects.add(nextProjectId, newProject);
    nextProjectId += 1;
  };

  public query ({ caller }) func getProjects() : async [Project] {
    projects.values().toArray();
  };

  public shared ({ caller }) func removeProject(id : Nat) : async Bool {
    if (projects.containsKey(id)) {
      projects.remove(id);
      true;
    } else {
      false;
    };
  };
};
