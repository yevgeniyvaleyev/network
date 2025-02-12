const { app } = require("@azure/functions");
const { getCurrentUser } = require("../auth/auth");
const { getDatabase } = require("../db/db");
const { parse } = require("csv-parse/sync");
const { v4: uuidv4 } = require("uuid");

const EXPECTED_HEADERS = [
  'name',
  'jobTitle',
  'workedAt',
  'phoneNumber',
  'preferredCommunicationChannel',
  'email',
  'communicationLanguage',
  'reconnectionFrequency',
  'lastConnect'
];

const parseDateDDMMYYYY = (dateStr) => {
  if (!dateStr) return null;
  
  // Check format DD/MM/YYYY
  const parts = dateStr.split('/');
  if (parts.length !== 3) {
    throw new Error('Date must be in DD/MM/YYYY format');
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JS months are 0-based
  const year = parseInt(parts[2], 10);

  // Validate parts
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    throw new Error('Date parts must be numbers');
  }

  // Validate ranges
  if (day < 1 || day > 31) {
    throw new Error('Day must be between 1 and 31');
  }
  if (month < 0 || month > 11) {
    throw new Error('Month must be between 01 and 12');
  }
  if (year < 1900 || year > 2100) {
    throw new Error('Year must be between 1900 and 2100');
  }

  const date = new Date(year, month, day);

  // Validate if it's a real date (e.g., not 31st of February)
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    throw new Error('Invalid date for the given month');
  }

  return date;
};

const validateHeaders = (headers) => {
  const missingHeaders = EXPECTED_HEADERS.filter(header => !headers.includes(header));
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
  }

  const extraHeaders = headers.filter(header => !EXPECTED_HEADERS.includes(header));
  if (extraHeaders.length > 0) {
    throw new Error(`Unexpected headers found: ${extraHeaders.join(', ')}`);
  }
};

const validateRecord = (record) => {
  const errors = [];

  // Required field validation
  if (!record.name?.trim()) {
    errors.push('Name is required');
  }

  // Email format validation
  if (record.email && !record.email.includes('@')) {
    errors.push('Invalid email format');
  }

  // Reconnection frequency validation
  if (record.reconnectionFrequency) {
    const frequency = parseInt(record.reconnectionFrequency, 10);
    if (isNaN(frequency) || frequency < 0) {
      errors.push('Reconnection frequency must be a positive number');
    }
  }

  // Date format validation
  if (record.lastConnect) {
    try {
      parseDateDDMMYYYY(record.lastConnect);
    } catch (error) {
      errors.push(`Invalid last connect date: ${error.message}`);
    }
  }

  return errors;
};

const sanitizeRecord = (record) => {
  // Trim all string values
  Object.keys(record).forEach(key => {
    if (typeof record[key] === 'string') {
      record[key] = record[key].trim();
    }
  });

  // Convert empty strings to null
  Object.keys(record).forEach(key => {
    if (record[key] === '') {
      record[key] = null;
    }
  });

  // Convert reconnectionFrequency to number
  if (record.reconnectionFrequency) {
    record.reconnectionFrequency = parseInt(record.reconnectionFrequency, 10);
  }

  // Convert lastConnect to Date object using DD/MM/YYYY format
  if (record.lastConnect) {
    record.lastConnect = parseDateDDMMYYYY(record.lastConnect);
  }

  return record;
};

app.http("upload", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const currentUser = await getCurrentUser(request, context);

    if (!currentUser.hasAccess) {
      return {
        status: 401,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ error: "Unauthorized" })
      };
    }

    const db = await getDatabase(context);
    const csvContent = await request.text();

    try {
      // Parse CSV content with strict column validation
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        skip_records_with_empty_values: true
      });

      // Validate CSV structure
      if (records.length === 0) {
        return {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ error: "CSV file is empty" })
        };
      }

      // Validate headers
      validateHeaders(Object.keys(records[0]));

      const results = {
        created: 0,
        updated: 0,
        errors: []
      };

      // Process each record
      for (const [index, record] of records.entries()) {
        try {
          // Validate record fields
          const validationErrors = validateRecord(record);
          if (validationErrors.length > 0) {
            results.errors.push(`Row ${index + 2}: ${validationErrors.join(', ')}`);
            continue;
          }

          // Sanitize record data
          const sanitizedRecord = sanitizeRecord(record);

          // Check if contact already exists
          const existingContact = await db.collection("network-list").findOne({
            name: sanitizedRecord.name,
            userId: currentUser.name
          });

          if (existingContact) {
            // Update existing contact
            await db.collection("network-list").updateOne(
              { id: existingContact.id },
              {
                $set: {
                  ...sanitizedRecord,
                  updatedAt: new Date()
                }
              }
            );
            results.updated++;
          } else {
            // Create new contact
            await db.collection("network-list").insertOne({
              id: uuidv4(),
              userId: currentUser.name,
              ...sanitizedRecord,
              createdAt: new Date(),
              updatedAt: new Date()
            });
            results.created++;
          }
        } catch (error) {
          results.errors.push(`Row ${index + 2}: ${error.message}`);
        }
      }

      return {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(results)
      };
    } catch (error) {
      context.error("Error processing CSV:", error);
      return {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: "Invalid CSV format or content",
          details: error.message
        })
      };
    }
  }
});
