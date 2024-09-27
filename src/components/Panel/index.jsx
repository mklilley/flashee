function Panel({ children, heading, color }) {

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
