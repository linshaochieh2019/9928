function maskContact(teacherDoc, { unlocked = false, isOwner = false } = {}) {
  if (!teacherDoc) return null;

  const teacher = teacherDoc.toObject ? teacherDoc.toObject() : teacherDoc;

  const showReal = unlocked || isOwner;
  console.log("maskContact - unlocked:", unlocked, "isOwner:", isOwner, "showReal:", showReal);

  const hasPhone = !!teacher.phone;
  const hasEmail = !!teacher.contactEmail;

  return {
    ...teacher,
    phone: showReal
      ? teacher.phone || null // show actual or null if not provided
      : null,                 // hide value when locked
    contactEmail: showReal
      ? teacher.contactEmail || null
      : null,
    locked: !showReal,
    meta: {
      hasPhone,
      hasEmail
    }
  };
}

module.exports = { maskContact };
