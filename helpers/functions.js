const typeCheck = (id) => {

  if (typeof id === String) {

    id = parseInt(id);

  };

  return id;

};

export {typeCheck}