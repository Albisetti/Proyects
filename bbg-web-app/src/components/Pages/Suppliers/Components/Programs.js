import React from "react";
import SimpleList from "../../../SimpleList";

const List = [
  { title: "ACME Co. Builder", color: "red" },
  { title: "Bob's Building", color: "blue" },
  { title: "SpliceDigital", color: "yellow" },
  {title:"ACME Co. Builder",color:'red'},
   {title:"Bob's Building", color:'blue'},
 {title:"SpliceDigital", color:'yellow'},
 { title: "ACME Co. Builder", color: "red" },
  { title: "Bob's Building", color: "blue" },
  { title: "SpliceDigital", color: "yellow" },
  {title:"ACME Co. Builder",color:'red'},
   {title:"Bob's Building", color:'blue'},
 {title:"SpliceDigital", color:'yellow'},
];

const Programs = ({archived}) => {
  return (
    <div>
      <SimpleList list={List} maxHeight='295px' />
    </div>
  );
};

export default Programs;
