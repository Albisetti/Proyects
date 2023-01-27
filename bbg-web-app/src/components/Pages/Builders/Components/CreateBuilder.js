import React, { useState, useEffect } from "react";
import TextField from "../../../FormGroups/Input";
import { useMutation } from "@apollo/client";
import {
  CREATE_ADMIN,
  UPDATE_ADMIN,
  FETCH_USERS_QUERY,
} from "../../../../lib/admin";

import Modal from "../../../Modal";
import Button from "../../../Buttons";
import CommonSelect from "../../../Select";

const CreateBuilder = ({ archieved, edit, user }) => {

  const [showModal, setShowModal] = useState(false);
  const [fields, setFields] = useState(user);
  const [updates, setUpdates] = useState(false);

  const optionsBuilders = [
    { value: "Acme Co. Builders", label: "Acme Co. Builders" },
    { value: "Bob Builders", label: "Bob Builders" },
    { value: "Splice Master Builders", label: "Splice Master Builders" },
  ];
  useEffect(() => {
    setFields(user);
    if (edit === false) {
      setFields({
        ...fields,
        first_name: "",
        last_name: "",
        email: "",
        id: "",
        title: "",
        office_phone: "",
        office_phone_ext: "",
        mobile_number: ""
      });
    }
  }, [user, edit,fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields({
      ...fields,
      [name]: value,
    });
    setUpdates(true);
  };

  const IconJSX = () => {
    return (
      <svg
        className="h-6 w-6 text-red-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    );
  };

  const [newAdmin] = useMutation(CREATE_ADMIN, {
    variables: {
      username: fields.first_name,
      email: fields.email,
      first_name: fields.first_name,
      last_name: fields.last_name,
    },
    update(cache, result) {
      const data = cache.readQuery({
        query: FETCH_USERS_QUERY,
      });
      delete Object.assign(result.data.createUser, {
        "node": result.data.createUser["user"],
      })["user"];
      cache.writeQuery({
        query: FETCH_USERS_QUERY,
        data: {
          users: {
            edges: [result.data.createUser, ...data.users.edges],
          },
        },
      });
    },
  });

  const [updateAdmin] = useMutation(UPDATE_ADMIN, {
    variables: {
      id: fields.id,
      email: fields.email,
      first_name: fields.first_name,
      last_name: fields.last_name,
    },
    update(cache, result) {
      const data = cache.readQuery({
        query: FETCH_USERS_QUERY,
      });
      delete Object.assign(result.data.updateUser, {
        "node": result.data.updateUser["user"],
      })["user"];
      cache.writeQuery({
        query: FETCH_USERS_QUERY,
        data: {
          users: {
            edges: [result.data.updateUser, ...data.users.edges],
          },
        },
      });
    },
  });

  const modal = () => {
    return (
      <>
        <Modal
          title="Confirm Archive"
          submitLabel="Confirm"
          onClose={() => setShowModal(false)}
          IconJSX={<IconJSX />}
          show={showModal}
        />
      </>
    );
  };

  return (
    <div className="bg-white grid grid-cols-6 border rounded-lg  rounded-t-none h-full">
      {modal()}

      <div className="col-span-6 sm:col-span-6 grid grid-cols-3 border-b px-4 items-center">
        <label className="block text-md font-medium text-secondary">Type</label>
        <CommonSelect
          className="mt-1"
          width={""}
          options={optionsBuilders}
          isMulti
          placeHolder="Select"
        />
      </div>

      <TextField
        flex
        parentClass="col-span-6 sm:col-span-6 border-b"
        id="first_name"
        label="First Name"
        onChange={handleChange}
          
         
        value={fields?.first_name}
          
        name="first_name"
        placeholder="First Name"
        type="text"
        disabled={archieved}
      />
      <TextField
        flex
        parentClass="col-span-6 sm:col-span-6 border-b"
        id="lastName"
        value={fields?.last_name}
        onChange={handleChange}
        label="Last Name"
          
         
          
        name="last_name"
        placeholder="Last Name"
        type="text"
        disabled={archieved}
      />

      <TextField
        flex
        width="w-24"
        parentClass="col-span-6 sm:col-span-6 border-b"
        id="title"
        onChange={handleChange}
        label="Title"
        value={fields && fields.title}
          
         
          
        name="title"
        placeholder="Title"
        type="text"
        disabled={archieved}
      />

      <div className="flex flex-col col-span-6 sm:col-span-6 border-b sm:grid sm:grid-cols-3 items-start justify-between px-4 xl:px-4 sm:items-center w-full py-3 xl:py-0">
        <label
          htmlFor="email"
          className="hover:block  text-md col-span-1  font-medium text-secondary"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          value={fields?.email}
          placeholder="xyz@gmail.com"
          id="email"
          className="mt-1 block input-no-error col-span-1 focus:outline-none shadow-sm sm:text-sm rounded-md"
        ></input>
        {fields && edit === true ? (
          <div className="col-span-2 sm:col-start-3 xl:col-start-4 ">
            <Button buttonClass="p-0" title="Send Invite" color="blue-800" />
          </div>
        ) : null}
      </div>
      <TextField
        flex
        width="w-32"
        label="Office Phone"
        onChange={handleChange}
        parentClass="col-span-4 sm:col-span-6 border-b"
        id="officePhone"
        value={fields && fields.userFields?.officePhone}
          
         
          
        name="officePhone"
        placeholder="123-456-7890"
        type="tel"
        disabled={archieved}
      />
      <TextField
        width="w-16"
        flex
        label="Ext."
        onChange={handleChange}
        value={fields && fields.userFields?.officePhoneExt}
        parentClass="col-span-2 sm:col-span-6 border-b"
        id="officeExtension"
          
         
          
        name="officeExtension"
        placeholder="112"
        disabled={archieved}
        type="tel"
      />
      <TextField
        flex
        width="w-32"
        label="Mobile Phone"
        parentClass="col-span-4 sm:col-span-6 "
        id="mobilePhone"
        onChange={handleChange}
          
         
        value={fields && fields.userFields?.mobilePhone}
          
        name="mobilePhone"
        placeholder="123-456-7890"
        type="tel"
        disabled={archieved}
      />
      <div className="col-span-6 sm:col-span-6 border-t">
        <div className="flex flex-col md:flex-row items-start sm:items-center justify-between gap-5 px-2 h-full">
          <div className="flex flex-col md:flex-row gap-5">
            {fields && edit === true ? (
              <Button
                title="Archive Administrator"
                onClick={() => setShowModal(true)}
                color="red-800"
              />
            ) : null}
            {edit ? (
              <>
                <Button title="Reset Password" color="secondary" />
              </>
            ) : null}
          </div>
          <div className="flex flex-col sm:flex-row">
            {edit && !updates ? null : (
              <Button
                title={edit?"Update": "Create"}
                color="primary"
                onClick={edit ? updateAdmin : newAdmin}
              />
            )}
            {edit === true ? null : (
              <Button title="Save and Send Invite" color="primary" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBuilder;
