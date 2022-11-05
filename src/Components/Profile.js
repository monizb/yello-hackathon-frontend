import "./Expense.css";

const Profile = (props) => {
  return (
    <div>
      {props.me && (
        <div className="set_profile_header">
          <img
            src={props.me.picture.small}
            style={{ height: 30, marginRight: 15, borderRadius: 1000 }}
            alt=""
          />
          <div>
            <p style={{ fontSize: 20 }}>{props.me.first_name}</p>
            <p style={{ fontSize: 16 }}>{props.me.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
