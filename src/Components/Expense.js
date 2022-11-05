import React, { useState } from "react";
import "./Expense.css";
import upiqr from "upiqr";
import Modal from "react-modal";

const currencyMap = {
  USD: "$",
  INR: "Rs.",
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },
};

const Expense = (props) => {
  const [qr, setQr] = useState("");
  const [paymentInfo, setPaymentInfo] = useState({});
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [showQr, setShowQr] = useState(false);
  const [upiId, setUpiId] = useState("");

  function generateQrCode(repayment, expense) {
    console.log(repayment.amount);
    let name = props.expense.users.find((user) => user.user_id === repayment.to)
      .user.first_name;
    upiqr({
      payeeVPA: upiId,
      payeeName: name,
      amount: repayment.amount,
      transactionNote: "Repayment For Splitwise Bill: " + expense.description,
    })
      .then((upi) => {
        console.log(upi);
        setQr(upi.qr);
        setPaymentInfo({
          payeeVPA: upiId,
          payeeName: props.expense.users.find(
            (user) => user.user_id === repayment.to
          ),
          amount: String(repayment.amount),
        });
        setIsOpen(true);
        setShowQr(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function closeModal() {
    setIsOpen(false);
    setQr("");
  }

  return (
    <div>
      {props.expense && <div className="expense" key={props.id}>
        <Modal isOpen={modalIsOpen} style={customStyles}>
          <div>
            {showQr && (
              <p style={{ marginBottom: 20 }}>
                Paying: {paymentInfo.payeeName.user.first_name},{" "}
                {paymentInfo.amount}
              </p>
            )}
          </div>
          <div style={{ alignItems: "center", display: "flex" }}>
            <input
              type="text"
              className="input_upi"
              placeholder="enter UPI id"
              onChange={(e) => setUpiId(e.target.value)}
            />
            <button
              className="payback_button"
              style={{ margin: 0, marginLeft: 15, padding: "10px 20px" }}
              onClick={() =>
                generateQrCode(
                  props.expense.repayments.find(
                    (user) => user.from === props.me.id
                  ),
                  props.expense
                )
              }
            >
              Generate Payment QR
            </button>
          </div>
          <div style={{ display: "block" }}>
            {showQr && <div>
                <img src={qr} style={{ marginTop: 15 }} />
            <div style={{ display: "block",marginTop:20 }}>
            Scan Using Any UPI App/Scanner
          </div>
          <div style={{marginTop: 15}}>
            <img src="https://1000logos.net/wp-content/uploads/2020/04/Google-Pay-Logo.png" style={{height: 30}} />
            <img src="https://www.pngitem.com/pimgs/m/3-38170_phonepe-logo-png-phone-pe-transparent-png.png" style={{height: 30}} />
            <img src="https://fastlegal.in/blog/wp-content/uploads/2021/06/images-18866637108299123004..jpg" style={{height: 30}} />
            <img src="https://i2.wp.com/zeevector.com/wp-content/uploads/Amazon-Pay-Logo-Colour.png?fit=1087%2C349&ssl=1" style={{height: 30}} />
          </div></div>}
          </div>
          
          <div style={{ display: "block" }}>
            <button
              className="payback_button"
              style={{
                backgroundColor: "red",
                padding: "10px 20px",
                marginTop: 35,
              }}
              onClick={closeModal}
            >
              Cancel Payment
            </button>
          </div>
        </Modal>
        <p className="expense_date">{new Date(props.date).toDateString()}</p>
        <div className="expense_root">
          <p className="expense_title">{props.title}</p>
          <div className="expense_meta">
            <p className="you_paid">
              You Paid: 
              {currencyMap[props.expense.currency_code] +
                props.expense.users.find((user) => user.user_id === props.me.id)
                  .paid_share}
            </p>
            {props.expense.users.find((user) => user.user_id === props.me.id)
              .net_balance > 0 ? (
              <p className="you_owe">
                You Are Owed:{" "}
                {currencyMap[props.expense.currency_code] +
                  props.expense.users.find(
                    (user) => user.user_id === props.me.id
                  ).net_balance}
              </p>
            ) : (
              <p className="you_owe">
                You Owe:{" "}
                {
                  //convert to positive number
                  currencyMap[props.expense.currency_code] +
                    Math.abs(
                      props.expense.users.find(
                        (user) => user.user_id === props.me.id
                      ).net_balance
                    )
                }
              </p>
            )}
          </div>
        </div>
        {props.expense.users.find((user) => user.user_id === props.me.id)
          .net_balance < 0 && (
          <button className="payback_button" onClick={() => setIsOpen(true)}>
            Pay Back
          </button>
        )}
        {props.expense.users.find((user) => user.user_id === props.me.id)
          .net_balance > 0 && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="other_users">
              <p
                style={{
                  marginTop: 20,
                  marginBottom: 10,
                  fontFamily: "Quicksand",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                Who Owes You Money:
              </p>
              {props.expense.users.map((user) => {
                if (user.user_id !== props.me.id && user.net_balance < 0) {
                  return (
                    <div className="other_user" key={user.user_id}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: 20,
                        }}
                      >
                        <img
                          src={user.user.picture.medium}
                          style={{
                            height: 30,
                            marginRight: 15,
                            borderRadius: 1000,
                          }}
                          alt=""
                        />
                        <p className="other_user_name">
                          {user.user.first_name}:{" "}
                        </p>
                        <p className="other_user_name">
                          {currencyMap[props.expense.currency_code] +
                            user.owed_share}
                        </p>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}
      </div>}
    </div>
  );
};

export default Expense;
