export const hints = {
  Community: "Tap + to create a post. Filter by In Need or To Help!",
  PostDetails:
    "Read the full post here, then use replies to offer help, ask a question, or share an update.",
  Notifications:
    "Notifications show posts and replies connected to you, so you can quickly follow up on help requests or offers.",
  Map: "Use the map to find nearby shelters, food resources, community centres, and emergency support locations.",
  Info: "Choose a disaster guide to learn what to do before, during, and after an emergency.",
  DisasterDetails:
    "Start with the overview, then use the checklist to track what you should do before, during, and after this emergency.",
  Post: "Create a post to ask for help or offer assistance. Include details about your needs or the support you can provide.",
  LocationDetails:
    "View this locations services, hours, contact info, and report updates if something has changed.",
};

function PageHint({ message, onClose }) {
  return (
    <div className="page-hint">
      <p>💡 {message}</p>
      <button onClick={onClose} className="page-hint-close">
        ✕
      </button>
    </div>
  );
}

export default PageHint;
