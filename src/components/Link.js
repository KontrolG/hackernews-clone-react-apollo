import React from "react";

function Link({ description, url }) {
  return (
    <div>
      <strong>{description}</strong> - {url}
    </div>
  );
}

export default Link;
