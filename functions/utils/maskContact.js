function maskContact(teacherDoc, { unlocked = false, isOwner = false } = {}) {
  if (!teacherDoc) return null;

  const teacher = teacherDoc.toObject ? teacherDoc.toObject() : teacherDoc;

  const showReal = unlocked || isOwner;
  console.log("maskContact - unlocked:", unlocked, "isOwner:", isOwner, "showReal:", showReal);
  // const showReal = true; // for now, always show

  return {
    ...teacher,
    phone: teacher.phone
      ? (showReal ? teacher.phone : "Hidden")
      : "Not provided",
    contactEmail: teacher.contactEmail
      ? (showReal ? teacher.contactEmail : "Hidden")
      : "Not provided",
    locked: !(showReal), // 👈 frontend can check this

    // for dev
    // locked: false,
  };
}

module.exports = { maskContact };
