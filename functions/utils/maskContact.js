function maskContact(teacherDoc) {
  if (!teacherDoc) return null;

  // Clone to plain object
  const teacher = teacherDoc.toObject ? teacherDoc.toObject() : teacherDoc;

  return {
    ...teacher,
    phone: teacher.phone ? "Hidden" : null,
    contactEmail: teacher.contactEmail ? "Hidden" : null,
  };
}

module.exports = { maskContact };
