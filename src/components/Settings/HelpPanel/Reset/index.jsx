import Modal from "../../../Modal";

function Reset({ close }) {
  function resetApp() {
    localStorage.clear();
    location.reload();
  }

  return (
    <Modal close={close} color="purple">
      <h2>Reset App</h2>
      Resetting the app will delete all local data and give you new online storage credentials. Your
      online data will persist, but you will lose access to it unless you have taken note of your
      storage ID and key. <br />
      <br />
      <button onClick={resetApp}>Yes, reset app</button> <br />
      <br />
      <button onClick={close}>No, take me back</button>
    </Modal>
  );
}

export default Reset;
