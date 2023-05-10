"use client";
import styles from "./Hairdressers.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoIosPerson, IoIosPersonAdd } from "react-icons/io";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import ConfirmDeletionPopUp from "../../commons/ConfirmDeletionPopUp/ConfirmDeletionPopUp";
import { BsPencilFill, BsTrashFill } from "react-icons/bs";
import { GoCheck } from "react-icons/go";

const Hairdressers = () => {
  const [hairdressers, setHairdressers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState([]);
  const [editingHairdresser, setEditingHairdresser] = useState(null);
  const [newName, setNewName] = useState("");
  const [selectedStartTimes, setSelectedStartTimes] = useState([]);
  const [selectedEndTimes, setSelectedEndTimes] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [sortedAvailableDays, setSortedAvailableDays] = useState([]);
  const [dayToAdd, setDayToAdd] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const [hairdresserToDelete, setHairdresserToDelete] = useState(null);
  const [creating, setCreating] = useState(false);

  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const openHour = 9;
  const closeHour = 21;
  const interval = 60;
  const schedules = [];

  for (let hour = openHour; hour <= closeHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      schedules.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "http://localhost:5000/api/hairdressers"
      );
      const sortedHairdressers = response.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setHairdressers(sortedHairdressers);
    }
    fetchData();
    setEditing(false);
  }, []);

  useEffect(() => {
    const sorted = availableDays.sort(
      (a, b) => days.indexOf(a) - days.indexOf(b)
    );
    setSortedAvailableDays(sorted);
  }, [availableDays]);

  const parseSchedules = (schedules) => {
    const scheduleTimes = schedules.split(",");
    const parsedSchedules = [];

    for (let i = 0; i < scheduleTimes.length; i++) {
      const time = scheduleTimes[i];

      if (!time.includes("-")) {
        parsedSchedules.push({
          day: { name: days[i], startTime: undefined, endTime: undefined },
        });
      } else {
        const [startTime, endTime] = time.split("-");
        parsedSchedules.push({
          day: { name: days[i], startTime: startTime, endTime: endTime },
        });
      }
    }
    return parsedSchedules;
  };

  const handleEdit = (hairdresser) => {
    const name = hairdresser.name;
    const parsedSchedules = parseSchedules(hairdresser.schedules);
    const startTimes = parsedSchedules.map(
      (schedule) => schedule.day.startTime
    );
    const endTimes = parsedSchedules.map((schedule) => schedule.day.endTime);

    setCreating(false);
    setNewName(name);
    setEditingSchedule(parsedSchedules);
    setSelectedStartTimes(startTimes);
    setSelectedEndTimes(endTimes);
    setEditing(true);
    setEditingHairdresser(hairdresser);

    const filteredDays = parsedSchedules
      .filter(
        (schedule) =>
          !schedule.day.startTime &&
          !schedule.day.endTime &&
          schedule.day.name !== "Domingo"
      )
      .map((schedule) => schedule.day.name);

    setAvailableDays(filteredDays);
  };

  const handleDeleteDay = (dayName) => {
    const updatedEditingSchedule = editingSchedule.map((schedule) => {
      if (schedule.day.name === dayName) {
        return {
          ...schedule,
          day: {
            ...schedule.day,
            startTime: undefined,
            endTime: undefined,
          },
        };
      }
      return schedule;
    });

    setEditingSchedule(updatedEditingSchedule);
    const index = days.indexOf(dayName);
    const newSelectedStartTimes = [...selectedStartTimes];
    const newSelectedEndTimes = [...selectedEndTimes];
    newSelectedStartTimes[index] = undefined;
    newSelectedEndTimes[index] = undefined;
    setSelectedStartTimes(newSelectedStartTimes);
    setSelectedEndTimes(newSelectedEndTimes);
    setAvailableDays([...availableDays, dayName]);
  };

  const handleStartTimeChange = (event, index) => {
    const newStartTime = event.target.value;
    const newStartTimes = [...selectedStartTimes];
    newStartTimes[index] = newStartTime;
    setSelectedStartTimes(newStartTimes);
  };

  const handleEndTimeChange = (event, index) => {
    const newEndTime = event.target.value;
    const newEndTimes = [...selectedEndTimes];
    newEndTimes[index] = newEndTime;
    setSelectedEndTimes(newEndTimes);
  };

  const handleAddDay = (day) => {
    if (newStartTime && newEndTime) {
      const index = days.indexOf(day);
      const newSelectedStartTimes = [...selectedStartTimes];
      const newSelectedEndTimes = [...selectedEndTimes];
      newSelectedStartTimes[index] = newStartTime;
      newSelectedEndTimes[index] = newEndTime;

      const updatedEditingSchedule = editingSchedule.map((schedule) => {
        if (schedule.day.name === day) {
          return {
            ...schedule,
            day: {
              ...schedule.day,
              startTime: newStartTime,
              endTime: newEndTime,
            },
          };
        }
        return schedule;
      });

      setSelectedStartTimes(newSelectedStartTimes);
      setSelectedEndTimes(newSelectedEndTimes);
      setDayToAdd("");
      setNewStartTime("");
      setNewEndTime("");
      setEditingSchedule(updatedEditingSchedule);
      setAvailableDays(availableDays.filter((d) => d !== day));
    }
  };

  function createHairdresser(newName, selectedStartTimes, selectedEndTimes) {
    const schedules = [];
    for (let i = 0; i < selectedStartTimes.length; i++) {
      const startTime = selectedStartTimes[i];
      const endTime = selectedEndTimes[i];
      startTime && endTime
        ? schedules.push(`${startTime}-${endTime}`)
        : schedules.push("undefined");
    }
    return {
      name: newName,
      schedules: schedules.join(","),
    };
  }

  const handleSave = async () => {
    const hairdresser = createHairdresser(
      newName,
      selectedStartTimes,
      selectedEndTimes
    );

    const name = hairdresser.name;
    const schedules = hairdresser.schedules;

    const response = await axios.put(
      `http://localhost:5000/api/hairdressers/${editingHairdresser.id}`,
      { name, schedules }
    );

    const newHairdressers = hairdressers.map((h) => {
      if (h.id === editingHairdresser.id) {
        return response.data;
      }
      return h;
    });
    setDayToAdd("");
    setNewStartTime("");
    setNewEndTime("");
    setHairdressers(newHairdressers);
    setEditingHairdresser(null);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditingHairdresser(null);
    setAvailableDays([]);
    setEditingSchedule([]);
    setDayToAdd("");
    setNewStartTime("");
    setNewEndTime("");
  };

  const handleDelete = (hairdresser) => {
    setShowPopUp(true);
    setHairdresserToDelete(hairdresser);
  };

  const handleConfirmDeletion = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/hairdressers/${hairdresserToDelete.id}`
      );
      setHairdressers(
        hairdressers.filter((h) => h.id !== hairdresserToDelete.id)
      );
      setHairdresserToDelete(null);
      setShowPopUp(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddHairdresser = async () => {
    setEditing(false);
    setCreating(true);
    setEditingHairdresser(null);
    setNewName("");

    const schedules =
      "undefined,undefined,undefined,undefined,undefined,undefined,undefined";

    const parsedSchedules = parseSchedules(schedules);
    const startTimes = parsedSchedules.map(
      (schedule) => schedule.day.startTime
    );
    const endTimes = parsedSchedules.map((schedule) => schedule.day.endTime);

    setEditingSchedule(parsedSchedules);
    setSelectedStartTimes(startTimes);
    setSelectedEndTimes(endTimes);

    const filteredDays = parsedSchedules
      .filter(
        (schedule) =>
          !schedule.day.startTime &&
          !schedule.day.endTime &&
          schedule.day.name !== "Domingo"
      )
      .map((schedule) => schedule.day.name);

    setAvailableDays(filteredDays);

    setTimeout(() => {
      const bottom = document.getElementById("bottom");
      if (bottom) {
        bottom.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
    }, 0);
  };

  const handleCancelHairdresserAddition = () => {
    setCreating(false);
  };

  const handleConfirmHairdresserAddition = async () => {
    if (
      selectedStartTimes.some((time) => time !== undefined) &&
      selectedEndTimes.some((time) => time !== undefined)
    ) {
      const hairdresser = createHairdresser(
        newName,
        selectedStartTimes,
        selectedEndTimes
      );

      const name = hairdresser.name;
      const schedules = hairdresser.schedules;

      const response = await axios.post(
        `http://localhost:5000/api/hairdressers/`,
        { name, schedules }
      );

      setNewName("");
      setDayToAdd("");
      setNewStartTime("");
      setNewEndTime("");
      setHairdressers(
        [...hairdressers, response.data].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );
      setCreating(false);
    } else {
      console.log("Debe ingresar al menos un horario para continuar.");
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="title">
          <IoIosPerson className="icon" />
          Peluqueros
        </h1>
        <div className={styles.list}>
          {hairdressers.map((hairdresser, index) => (
            <div key={index} className={styles.list__item}>
              <div className={styles.list__field}>
                <p className={styles.list__label}>Nombre</p>
                {editing && editingHairdresser.id === hairdresser.id ? (
                  <input
                    type="text"
                    className={`input ${styles.list__input}`}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                ) : (
                  <p className={styles.list__content}>{hairdresser.name}</p>
                )}
              </div>
              <div className={styles.list__field}>
                <p className={styles.list__label}>Días</p>
                {editing && editingHairdresser.id === hairdresser.id ? (
                  editingSchedule.map(
                    (schedule, index) =>
                      schedule.day.startTime &&
                      schedule.day.endTime && (
                        <ul className={styles.list__daysList} key={index}>
                          <li
                            key={index}
                            className={`${styles.list__content} ${styles["list__content--edit"]}`}>
                            <FaMinusCircle
                              className={styles.list__minusIcon}
                              onClick={() => handleDeleteDay(schedule.day.name)}
                            />
                            {schedule.day.name}
                          </li>
                        </ul>
                      )
                  )
                ) : (
                  <ul className={styles.list__daysList}>
                    {parseSchedules(hairdresser.schedules).map(
                      (schedule, index) => {
                        if (schedule.day.startTime && schedule.day.endTime) {
                          return (
                            <li key={index} className={styles.list__content}>
                              {schedule.day.name}
                            </li>
                          );
                        }
                      }
                    )}
                  </ul>
                )}
                {editing &&
                editingHairdresser.id === hairdresser.id &&
                sortedAvailableDays.length ? (
                  <div className={styles.list__addDay}>
                    <FaPlusCircle
                      className={styles.list__plusIcon}
                      onClick={() => handleAddDay(dayToAdd)}
                    />
                    <select
                      className={`input ${styles.list__inputSmall}`}
                      onChange={(e) => setDayToAdd(e.target.value)}
                      value={dayToAdd}>
                      <option value=""></option>
                      {sortedAvailableDays.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </div>
              <div className={styles.list__field}>
                <p className={styles.list__label}>Ingreso</p>
                {editing && editingHairdresser.id === hairdresser.id ? (
                  editingSchedule.map((schedule, index) => {
                    const startTime =
                      selectedStartTimes[index] || schedule.day.startTime;
                    if (schedule.day.startTime && schedule.day.endTime) {
                      return (
                        <select
                          className={`input ${styles.list__inputSmall}`}
                          required
                          value={startTime}
                          key={index}
                          onChange={(event) =>
                            handleStartTimeChange(event, index)
                          }>
                          {schedules.map((time, index) => {
                            if (time.split(":")[0] < 18) {
                              return (
                                <option key={index} value={time}>
                                  {time}
                                </option>
                              );
                            }
                          })}
                        </select>
                      );
                    } else {
                      return null;
                    }
                  })
                ) : (
                  <ul className={styles.list__daysList}>
                    {parseSchedules(hairdresser.schedules).map(
                      (schedule, index) => {
                        if (schedule.day.startTime && schedule.day.endTime) {
                          return (
                            <li key={index} className={styles.list__content}>
                              {schedule.day.startTime} hs.
                            </li>
                          );
                        } else {
                          return null;
                        }
                      }
                    )}
                  </ul>
                )}
                {editing &&
                editingHairdresser.id === hairdresser.id &&
                sortedAvailableDays.length ? (
                  <div className={styles.list__addDay}>
                    <select
                      className={`input ${styles.list__inputSmall}`}
                      required
                      value={newStartTime}
                      onChange={(event) => setNewStartTime(event.target.value)}>
                      <option value=""></option>
                      {schedules.map((time, index) => {
                        if (time.split(":")[0] < 18) {
                          return (
                            <option key={index} value={time}>
                              {time}
                            </option>
                          );
                        }
                      })}
                    </select>
                  </div>
                ) : null}
              </div>
              <div className={styles.list__field}>
                <p className={styles.list__label}>Salida</p>
                {editing && editingHairdresser.id === hairdresser.id ? (
                  editingSchedule.map((schedule, i) => {
                    const endTime = selectedEndTimes[i] || schedule.day.endTime;
                    if (schedule.day.startTime && schedule.day.endTime) {
                      return (
                        <select
                          className={`input ${styles.list__inputSmall}`}
                          required
                          value={endTime}
                          key={i}
                          onChange={(event) => handleEndTimeChange(event, i)}>
                          {schedules.map((time, index) => {
                            return (
                              time.split(":")[0] >
                                selectedStartTimes[i].split(":")[0] && (
                                <option key={index} value={time}>
                                  {time}
                                </option>
                              )
                            );
                          })}
                        </select>
                      );
                    } else {
                      return null;
                    }
                  })
                ) : (
                  <ul className={styles.list__daysList}>
                    {parseSchedules(hairdresser.schedules).map(
                      (schedule, index) => {
                        if (schedule.day.startTime && schedule.day.endTime) {
                          return (
                            <li key={index} className={styles.list__content}>
                              {schedule.day.endTime} hs.
                            </li>
                          );
                        } else {
                          return null;
                        }
                      }
                    )}
                  </ul>
                )}
                {editing &&
                editingHairdresser.id === hairdresser.id &&
                sortedAvailableDays.length ? (
                  <div className={styles.list__addDay}>
                    <select
                      className={`input ${styles.list__inputSmall}`}
                      required
                      value={newEndTime}
                      onChange={(event) => setNewEndTime(event.target.value)}>
                      <option value=""></option>
                      {schedules.map((time, index) => {
                        return (
                          time.split(":")[0] > newStartTime.split(":")[0] && (
                            <option key={index} value={time}>
                              {time}
                            </option>
                          )
                        );
                      })}
                    </select>
                  </div>
                ) : null}
              </div>
              {editing && editingHairdresser.id === hairdresser.id ? (
                <div className={styles.list__buttons}>
                  <button
                    className={"btn-tertiary btn-round btn-success"}
                    onClick={handleSave}
                    disabled={
                      !newName ||
                      selectedStartTimes.every((time) => time === undefined) ||
                      selectedEndTimes.every((time) => time === undefined)
                    }>
                    <GoCheck />
                  </button>
                  <button
                    className={"btn-tertiary btn-round"}
                    onClick={handleCancel}>
                    &#x2715;
                  </button>
                </div>
              ) : (
                <div className={styles.list__buttons}>
                  <button
                    className={"btn-tertiary btn-round"}
                    onClick={() => handleEdit(hairdresser)}>
                    <BsPencilFill />
                  </button>
                  <button
                    className={"btn-tertiary btn-round"}
                    onClick={() => handleDelete(hairdresser)}>
                    <BsTrashFill />
                  </button>
                </div>
              )}
            </div>
          ))}
          {!creating && (
            <div
              className={`link ${styles.addItem}`}
              onClick={handleAddHairdresser}>
              <p>Agregar</p>
              <IoIosPersonAdd className={styles.addItem__icon} />
            </div>
          )}
          {creating && (
            <div
              className={styles.list__item}
              style={{ marginBottom: "2rem" }}
              id="bottom">
              <div className={styles.list__field}>
                <p className={styles.list__label}>Nombre</p>
                <input
                  type="text"
                  className={`input ${styles.list__input}`}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className={styles.list__field}>
                <p className={styles.list__label}>Días</p>
                {editingSchedule.map(
                  (schedule, index) =>
                    schedule.day.startTime &&
                    schedule.day.endTime && (
                      <ul className={styles.list__daysList} key={index}>
                        <li
                          key={index}
                          className={`${styles.list__content} ${styles["list__content--edit"]}`}>
                          <FaMinusCircle
                            className={styles.list__minusIcon}
                            onClick={() => handleDeleteDay(schedule.day.name)}
                          />
                          {schedule.day.name}
                        </li>
                      </ul>
                    )
                )}
                {sortedAvailableDays.length > 0 && (
                  <div className={styles.list__addDay}>
                    <FaPlusCircle
                      className={styles.list__plusIcon}
                      onClick={() => handleAddDay(dayToAdd)}
                    />
                    <select
                      className={`input ${styles.list__inputSmall}`}
                      onChange={(e) => setDayToAdd(e.target.value)}
                      value={dayToAdd}>
                      <option value=""></option>
                      {sortedAvailableDays.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className={styles.list__field}>
                <p className={styles.list__label}>Ingreso</p>
                {editingSchedule.map((schedule, index) => {
                  const startTime =
                    selectedStartTimes[index] || schedule.day.startTime;
                  if (schedule.day.startTime && schedule.day.endTime) {
                    return (
                      <select
                        className={`input ${styles.list__inputSmall}`}
                        required
                        value={startTime}
                        key={index}
                        onChange={(event) =>
                          handleStartTimeChange(event, index)
                        }>
                        {schedules.map((time, index) => {
                          if (time.split(":")[0] < 18) {
                            return (
                              <option key={index} value={time}>
                                {time}
                              </option>
                            );
                          }
                        })}
                      </select>
                    );
                  } else {
                    return null;
                  }
                })}
                {sortedAvailableDays.length > 0 && (
                  <div className={styles.list__addDay}>
                    <select
                      className={`input ${styles.list__inputSmall}`}
                      required
                      value={newStartTime}
                      onChange={(event) => setNewStartTime(event.target.value)}>
                      <option value=""></option>
                      {schedules.map((time, index) => {
                        if (time.split(":")[0] < 18) {
                          return (
                            <option key={index} value={time}>
                              {time}
                            </option>
                          );
                        }
                      })}
                    </select>
                  </div>
                )}
              </div>
              <div className={styles.list__field}>
                <p className={styles.list__label}>Salida</p>
                {editingSchedule.map((schedule, i) => {
                  const endTime = selectedEndTimes[i] || schedule.day.endTime;
                  if (schedule.day.startTime && schedule.day.endTime) {
                    return (
                      <select
                        className={`input ${styles.list__inputSmall}`}
                        required
                        value={endTime}
                        key={i}
                        onChange={(event) => handleEndTimeChange(event, i)}>
                        {schedules.map((time, index) => {
                          return (
                            time.split(":")[0] >
                              selectedStartTimes[i].split(":")[0] && (
                              <option key={index} value={time}>
                                {time}
                              </option>
                            )
                          );
                        })}
                      </select>
                    );
                  } else {
                    return null;
                  }
                })}
                {sortedAvailableDays.length > 0 && (
                  <div className={styles.list__addDay}>
                    <select
                      className={`input ${styles.list__inputSmall}`}
                      required
                      value={newEndTime}
                      onChange={(event) => setNewEndTime(event.target.value)}>
                      <option value=""></option>
                      {schedules.map((time, index) => {
                        return (
                          time.split(":")[0] > newStartTime.split(":")[0] && (
                            <option key={index} value={time}>
                              {time}
                            </option>
                          )
                        );
                      })}
                    </select>
                  </div>
                )}
              </div>
              {
                <div className={styles.list__buttons}>
                  <button
                    className={"btn-tertiary btn-round btn-success"}
                    onClick={handleConfirmHairdresserAddition}
                    disabled={
                      !newName ||
                      selectedStartTimes.every((time) => time === undefined) ||
                      selectedEndTimes.every((time) => time === undefined)
                    }>
                    <GoCheck />
                  </button>
                  <button
                    className={"btn-tertiary btn-round"}
                    onClick={handleCancelHairdresserAddition}>
                    &#x2715;
                  </button>
                </div>
              }
            </div>
          )}
        </div>
      </div>
      {showPopUp && (
        <ConfirmDeletionPopUp
          hairdresser={hairdresserToDelete}
          onCancel={() => {
            setShowPopUp(false);
            setHairdresserToDelete(null);
          }}
          onConfirm={handleConfirmDeletion}
        />
      )}
    </>
  );
};

export default Hairdressers;
