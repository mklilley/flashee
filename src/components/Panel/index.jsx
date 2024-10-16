function Panel({ children, heading, color="purple" }) {

  return (

      <div className={`panel ${color}`}>
        <h3 className="open">{heading}</h3>
        <div className="items">
          {children}
        </div>
      </div>
  );
}

export default Panel;
