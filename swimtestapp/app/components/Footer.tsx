function Footer() {
  return (
    <>
      <footer className="text-center text-gray-500 mb-5 ml-5 mr-5">
        Creating a Safer Tomorrow, Today. One Goal: Zero Drownings.
        <br />
        Data is synced with the Google Sheet on the supervisor account.
        <br />
        For support, please email{" "}
        <a
          href="mailto:contact@brandonlui.com"
          className="text-blue-500 hover:underline"
        >
          contact@brandonlui.com
        </a>{" "}
        or call{" "}
        <a href="tel:+18024172584" className="text-blue-500 hover:underline ">
          +1 (802) 417-BLUI
        </a>{" "}
        (1-802-417-2584).
      </footer>
      <div style={{ height: "48vh" }}></div>
    </>
  );
}

export default Footer;
