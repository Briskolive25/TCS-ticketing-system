import React, { useState, useEffect } from "react";

export default function AddKPI() {
  const [showForm, setShowForm] = useState(false);
  const [hiringPeriod, setHiringPeriod] = useState("annually");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewRow, setViewRow] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    dateFrom: "",
    dateTo: "",
    employee: "",
  });
  const today = new Date().toISOString().slice(0, 10);
  const SHEET_ID = "13eeOg2QaKERDUb9ZYEK7rRz5V9xwiSFCjPZ1yBW8NxQ";
  const SHEET_GID = "1517232180";
  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?gid=${SHEET_GID}&tqx=out:json&headers=1`;
  const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;
  const HIRING_SHEET_ID = "1pUlMGL05gnCr8Aqf-dWnzpXwTqYmW2oiONnFZw8L8qM";
  const HIRING_SHEET_GID = "1974836380";
  const HIRING_SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${HIRING_SHEET_ID}/export?format=csv&gid=${HIRING_SHEET_GID}`;
  const HIRING_KPI_NAME = "Hiring New Joinees Fast";
  const HIRING_EXPERIENCED_KPI_NAME = "Hiring Experienced Employees Fast";
  const ONBOARDING_SHEET_ID = "1lCR-U79naPW6GPS8CRQb89o7Oebc-mY8g9nWw62PdGk";
  const ONBOARDING_SHEET_GID = "1913252029";
  const ONBOARDING_SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${ONBOARDING_SHEET_ID}/export?format=csv&gid=${ONBOARDING_SHEET_GID}`;
  const ONBOARDING_SCORE_COLUMN = "BW";
  const ONBOARDING_KPI_NAME = "Onboarding Tasks Completion";
  const EXIT_SHEET_ID = "19xZwCcBoTepR64kKoj_Gum29cX3MF9rcYhl0dVXjTuM";
  const EXIT_SHEET_GID = "0";
  const EXIT_SCORE_COLUMN = "W";
  const EXIT_SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${EXIT_SHEET_ID}/export?format=csv&gid=${EXIT_SHEET_GID}`;
  const EXIT_KPI_NAME = "Exit Tasks Completion";
  const RENEWALS_SHEET_ID = "1R0iZcs6uEe8FgwE72TH1SFHV86JBZM9Qaz4VERgpkT8";
  const RENEWALS_MASTER_SHEET = "MASTER_RENEWALS_REGISTER";
  const RENEWALS_LOG_SHEET = "RENEWAL_EVENTS_LOG";
  const RENEWALS_MASTER_CSV_URL = `https://docs.google.com/spreadsheets/d/${RENEWALS_SHEET_ID}/export?format=csv&sheet=${RENEWALS_MASTER_SHEET}`;
  const RENEWALS_LOG_CSV_URL = `https://docs.google.com/spreadsheets/d/${RENEWALS_SHEET_ID}/export?format=csv&sheet=${RENEWALS_LOG_SHEET}`;
  const CLEANING_SHEET_ID = "1Epb6rPh_cD-SDoaiRJQqNcfeY-R1sWnlzhIjhHJy-jM";
  const CLEANING_SHEET_GID = "0";
  const CLEANING_SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${CLEANING_SHEET_ID}/export?format=csv&gid=${CLEANING_SHEET_GID}`;
  const BOARD_MEETING_SHEET_GID = "1186568509";
  const BOARD_MEETING_SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${CLEANING_SHEET_ID}/export?format=csv&gid=${BOARD_MEETING_SHEET_GID}`;
  const CLEANING_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxCgepZrrMu0Pv5BGmt4iQ-Y0o5Xd4yOFDKIDWy4QNG_CR1JknlovCE2swPv7vh4Tg1xA/exec";
  const OFFICE_CLEANING_KPI_NAME = "Office Daily Cleaning";
  const BOARD_MEETING_KPI_NAME = "Quarterly Board Meeting";

  const [sheetRows, setSheetRows] = useState([]);
  const [sheetLoading, setSheetLoading] = useState(true);
  const [sheetError, setSheetError] = useState("");
  const [hiringMeta, setHiringMeta] = useState({
    loading: true,
    error: "",
    cumulativeScore: null,
    startDate: "",
    plannedDate: "",
    actualValue: "",
    kpiDays: "",
    joinedCount: 0,
  });
  const [hiringExperiencedMeta, setHiringExperiencedMeta] = useState({
    loading: true,
    error: "",
    cumulativeScore: null,
    startDate: "",
    plannedDate: "",
    actualValue: "",
    kpiDays: "",
    joinedCount: 0,
  });
  const [renewalsMeta, setRenewalsMeta] = useState({
    loading: true,
    error: "",
    cumulativeScore: null,
  });
  const [onboardingMeta, setOnboardingMeta] = useState({
    loading: true,
    error: "",
    sum: null,
  });
  const [exitMeta, setExitMeta] = useState({
    loading: true,
    error: "",
    sum: null,
  });
  const [roleNameMap, setRoleNameMap] = useState({});
  const [allAssignableNames, setAllAssignableNames] = useState([]);
  const [nameDesignationMap, setNameDesignationMap] = useState({});
  const [assignedOverrides, setAssignedOverrides] = useState({});
  const [cleaningStatusToday, setCleaningStatusToday] = useState("");
  const [boardMeetingMeta, setBoardMeetingMeta] = useState({
    status: "",
    lastDateKey: "",
    canUpdate: true,
  });

  const initialForm = {
    kpiId: "",
    createdDate: today,
    createdBy: "",
    department: "",
    process: "",
    subprocess: "",
    role: "",
    kpi: "",
    startDate: "",
    expiryDate: "",
    description: "",
    frequencyType: "",
    action: "",
    deadline: "",
    valueType: "",
    value: "",
    maxMin: "",
    scoringFrequency: "",
    triggerTime: "",
    reportingFrequency: "",
    carryRule: "",
    leaveApplicable: "",
    status: "",
    cancelReason: "",
    updateMethod: "",
    actualSource: "",
    scoringScale: "",
  };

  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("KPI Submitted");
    setShowForm(false);
    setForm(initialForm);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ search: "", department: "", dateFrom: "", dateTo: "", employee: "" });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.department, filters.dateFrom, filters.dateTo, filters.employee, rowsPerPage]);

  const normalize = (value) =>
    (value || "").toString().toLowerCase().replace(/\s+/g, " ").trim();

  const getField = (row, labelOrLabels, fallbackKey) => {
    if (!row) return "";
    if (fallbackKey && row.__override && row[fallbackKey] !== undefined && row[fallbackKey] !== null && row[fallbackKey] !== "") {
      return row[fallbackKey];
    }
    if (row.__isFallback && fallbackKey) {
      return row[fallbackKey] ?? "";
    }
    const labels = Array.isArray(labelOrLabels) ? labelOrLabels : [labelOrLabels];
    for (const label of labels) {
      const key = normalize(label);
      if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
        return row[key];
      }
    }
    if (fallbackKey && row[fallbackKey] !== undefined && row[fallbackKey] !== null && row[fallbackKey] !== "") {
      return row[fallbackKey];
    }
    return "";
  };

  const toNumber = (value) => {
    if (value === null || value === undefined) return null;
    const cleaned = value.toString().replace(/[^0-9.-]/g, "");
    if (!cleaned) return null;
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : null;
  };

  const colLettersToIndex = (letters) => {
    if (!letters) return 0;
    let index = 0;
    const text = letters.toString().trim().toUpperCase();
    for (let i = 0; i < text.length; i += 1) {
      index = index * 26 + (text.charCodeAt(i) - 64);
    }
    return Math.max(index - 1, 0);
  };

  const pickFirstNonEmpty = (values) => values.find((value) => value) || "";

  const getCsvCell = (row, index) => {
    if (!row || row.length <= index) return "";
    return (row[index] || "").toString().trim();
  };

  // ── checks if ANY cell in the row contains "joined" ──────────────────────
  // This is more reliable than checking only col 29 in case column positions shift
  const isJoinedRow = (row) => {
    if (!row) return false;
    return row.some((cell) =>
      (cell || "").toString().toLowerCase().includes("joined")
    );
  };

  // ── also keep original for targeted col check ─────────────────────────────
  const isJoined = (value) => normalize(value).includes("joined");

  const normalizeDateKey = (value) => {
    if (!value) return "";
    const raw = value.toString().trim();
    const parts = raw.replace(/[^0-9]/g, " ").trim().split(/\s+/).map(Number);
    if (parts.length < 3) return "";
    const [p1, p2, p3] = parts;
    let day, month, year;
    if (p3 > 31) {
      year = p3;
      if (p1 > 12) { day = p1; month = p2; }
      else if (p2 > 12) { month = p2; day = p1; }
      else { day = p1; month = p2; }
    } else {
      year = p1;
      if (p2 > 12) { day = p2; month = p3; }
      else { month = p2; day = p3; }
    }
    if (!day || !month || !year) return "";
    const dd = `${day}`.padStart(2, "0");
    const mm = `${month}`.padStart(2, "0");
    const yyyy = `${year}`.padStart(4, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const parseTextDate = (value) => {
    if (!value) return null;
    const raw = value.toString().trim();
    const monthMap = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11,
    };

    // Format: "18 Mar 2026" or "Mar 18 2026" or "18 Mar 26"
    const parts = raw.replace(/,/g, "").split(/\s+/);
    if (parts.length >= 3) {
      // Try "18 Mar 2026"
      if (monthMap[parts[1]?.toLowerCase()] !== undefined) {
        const day = Number(parts[0]);
        const month = monthMap[parts[1].toLowerCase()];
        let year = Number(parts[2]);
        if (year < 100) year += 2000;
        if (Number.isFinite(day) && Number.isFinite(year)) {
          return new Date(year, month, day);
        }
      }
      // Try "Mar 18 2026"
      if (monthMap[parts[0]?.toLowerCase()] !== undefined) {
        const month = monthMap[parts[0].toLowerCase()];
        const day = Number(parts[1]);
        let year = Number(parts[2]);
        if (year < 100) year += 2000;
        if (Number.isFinite(day) && Number.isFinite(year)) {
          return new Date(year, month, day);
        }
      }
    }
    const normalized = normalizeDateKey(raw);
    if (!normalized) return null;
    return dateKeyToDate(normalized);
  };

  const dateKeyToDate = (key) => {
    if (!key) return null;
    const [yyyy, mm, dd] = key.split("-").map(Number);
    if (!yyyy || !mm || !dd) return null;
    return new Date(yyyy, mm - 1, dd);
  };

  const toDate = (value) => parseTextDate(value);

  const addMonths = (date, months) => {
    const next = new Date(date.getTime());
    next.setMonth(next.getMonth() + months);
    return next;
  };

  const diffInDays = (fromDate, toDateValue) => {
    if (!fromDate || !toDateValue) return 0;
    const start = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    const end = new Date(toDateValue.getFullYear(), toDateValue.getMonth(), toDateValue.getDate());
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  // ── Extract joining date from hiring history text ─────────────────────────
  // Handles formats like:
  // "Mar 18 2026 - New Hiring Initiated; Mar 25 2026 - Joined"
  // "18 Mar 2026 - Joined"
  // "Joined on 18 Mar 2026"
  // "18-Mar-2026 - Joined"
  const extractJoinedDateFromHistory = (historyText) => {
    if (!historyText) return null;
    const text = historyText.toString();

    // Split by semicolon or newline to get individual history entries
    const entries = text.split(/[;\n]+/).map((s) => s.trim()).filter(Boolean);

    for (const entry of entries) {
      if (!entry.toLowerCase().includes("joined")) continue;

      // Try multiple date patterns in the entry

      // Pattern 1: "18 Mar 2026" or "18 Mar 26"
      const p1 = entry.match(/(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{2,4})/);
      if (p1) {
        const attempt = parseTextDate(`${p1[1]} ${p1[2]} ${p1[3]}`);
        if (attempt && !isNaN(attempt)) return attempt;
      }

      // Pattern 2: "Mar 18 2026" or "Mar 18 26"
      const p2 = entry.match(/([A-Za-z]{3,})\s+(\d{1,2})\s*[,]?\s*(\d{2,4})/);
      if (p2) {
        const attempt = parseTextDate(`${p2[1]} ${p2[2]} ${p2[3]}`);
        if (attempt && !isNaN(attempt)) return attempt;
      }

      // Pattern 3: "18-Mar-2026" or "18/Mar/2026"
      const p3 = entry.match(/(\d{1,2})[\-\/]([A-Za-z]{3,})[\-\/](\d{2,4})/);
      if (p3) {
        const attempt = parseTextDate(`${p3[1]} ${p3[2]} ${p3[3]}`);
        if (attempt && !isNaN(attempt)) return attempt;
      }

      // Pattern 4: "2026-03-18" or "18/03/2026" or "18-03-2026"
      const p4 = entry.match(/(\d{1,4})[\/\-](\d{1,2})[\/\-](\d{1,4})/);
      if (p4) {
        const attempt = parseTextDate(entry);
        if (attempt && !isNaN(attempt)) return attempt;
      }
    }

    return null;
  };

  const departmentPalette = [
    { accent: "#e0f2fe", border: "#bae6fd", text: "#0c4a6e" },
    { accent: "#dcfce7", border: "#bbf7d0", text: "#14532d" },
    { accent: "#fef9c3", border: "#fef08a", text: "#854d0e" },
    { accent: "#fee2e2", border: "#fecaca", text: "#7f1d1d" },
    { accent: "#ede9fe", border: "#ddd6fe", text: "#4c1d95" },
    { accent: "#ffe4e6", border: "#fecdd3", text: "#9f1239" },
    { accent: "#e2e8f0", border: "#cbd5f5", text: "#1e3a8a" },
  ];

  const getDeptPalette = (name) => {
    const key = (name || "").toString();
    let hash = 0;
    for (let i = 0; i < key.length; i += 1) {
      hash = (hash + key.charCodeAt(i)) % departmentPalette.length;
    }
    return departmentPalette[hash] || departmentPalette[0];
  };

  const extractJoinedDate = (value) => {
    if (!value) return "";
    const text = value.toString();
    if (!isJoined(text)) return "";
    const parts = text.split("-");
    return (parts[0] || "").trim();
  };

  const formatScore = (value) => {
    if (value === null || value === undefined || value === "") return "";
    return Number(value) > 0 ? `+${value}` : `${value}`;
  };

  const getScoringScaleFromDiff = (diffValue) => {
    const diff = Math.abs(diffValue);
    const scalingRules = [
      { threshold: 1000000, divisor: 100000 },
      { threshold: 100000, divisor: 10000 },
      { threshold: 10000, divisor: 1000 },
      { threshold: 1000, divisor: 100 },
      { threshold: 100, divisor: 10 },
    ];
    for (const rule of scalingRules) {
      if (diff >= rule.threshold) return Math.floor(diff / rule.divisor);
    }
    return diff;
  };

  const getScoringScale = (targetValue, actualValue, scoreValue) => {
    const scoreNum = toNumber(scoreValue);
    if (scoreNum !== null) return getScoringScaleFromDiff(scoreNum);
    const targetNum = toNumber(targetValue);
    const actualNum = toNumber(actualValue);
    if (targetNum === null || actualNum === null) return "";
    return getScoringScaleFromDiff(targetNum - actualNum);
  };

  const postCleaningStatus = async (statusValue) => {
    if (!CLEANING_SCRIPT_URL) return;
    const now = new Date();
    const payload = {
      date: now.toLocaleDateString("en-GB"),
      time: now.toLocaleTimeString("en-GB"),
      status: statusValue,
    };
    try {
      const query = new URLSearchParams(payload).toString();
      await fetch(`${CLEANING_SCRIPT_URL}?${query}`);
    } catch {
      // Silent fail
    }
  };

  const postBoardMeetingStatus = async (statusValue) => {
    if (!CLEANING_SCRIPT_URL) return;
    const now = new Date();
    const payload = {
      date: now.toLocaleDateString("en-GB"),
      time: now.toLocaleTimeString("en-GB"),
      status: statusValue,
      sheet: "BoardMeeting",
    };
    try {
      const query = new URLSearchParams(payload).toString();
      await fetch(`${CLEANING_SCRIPT_URL}?${query}`);
    } catch {
      // Silent fail
    }
  };

  const parseCSV = (text) => {
    const rows = [];
    let cur = "";
    let inQuotes = false;
    let row = [];
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];
      if (char === "\"" && inQuotes && next === "\"") {
        cur += "\"";
        i++;
      } else if (char === "\"") {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        row.push(cur);
        cur = "";
      } else if ((char === "\n" || char === "\r") && !inQuotes) {
        if (cur.length || row.length) {
          row.push(cur);
          rows.push(row);
          row = [];
          cur = "";
        }
        if (char === "\r" && next === "\n") i++;
      } else {
        cur += char;
      }
    }
    if (cur.length || row.length) {
      row.push(cur);
      rows.push(row);
    }
    return rows;
  };

  // ── ROLE -> NAME MAP (Onboarding sheet) ──
  useEffect(() => {
    let isActive = true;
    const loadRoleNames = async () => {
      try {
        const res = await fetch(ONBOARDING_SHEET_CSV_URL);
        const text = await res.text();
        if (text.includes("<!DOCTYPE html") || text.includes("accounts.google.com")) return;
        const rows = parseCSV(text);
        const dataRows = rows.slice(1);
        const map = new Map();
        const allNames = [];
        const allNameKeys = new Set();
        const nameDesignation = new Map();

        dataRows.forEach((row) => {
          const name = (row[0] || "").toString().trim();
          const role = (row[6] || "").toString().trim();
          const status = (row[12] || "").toString().trim();
          if (!name) return;
          if (status.toLowerCase().includes("left")) return;

          const roleKey = normalize(role);
          const nameKey = normalize(name);

          if (!allNameKeys.has(nameKey)) {
            allNameKeys.add(nameKey);
            allNames.push(name);
          }

          if (role && !nameDesignation.has(nameKey)) {
            nameDesignation.set(nameKey, role);
          }

          if (!role) return;

          const existing = map.get(roleKey) || [];
          if (!existing.includes(name)) {
            map.set(roleKey, [...existing, name]);
          }
        });

        if (isActive) {
          const obj = {};
          map.forEach((names, key) => {
            obj[key] = names;
          });
          setRoleNameMap(obj);
          setAllAssignableNames(allNames);
          const designationObj = {};
          nameDesignation.forEach((value, key) => {
            designationObj[key] = value;
          });
          setNameDesignationMap(designationObj);
        }
      } catch {
        // Silent fail
      }
    };
    loadRoleNames();
    return () => { isActive = false; };
  }, []);

  // ── KPI MASTER SHEET ───────────────────────────────────────────────────────
  useEffect(() => {
    let isActive = true;
    const loadSheet = async () => {
      setSheetLoading(true);
      setSheetError("");
      try {
        let mapped = [];
        try {
          const res = await fetch(SHEET_URL);
          const text = await res.text();
          const jsonText = text.replace(/^[^(]*\(/, "").replace(/\);?\s*$/, "");
          const data = JSON.parse(jsonText);
          const cols = (data.table.cols || []).map((c) => (c.label || "").trim());
          const rows = (data.table.rows || []).map((r) =>
            (r.c || []).map((cell) => (cell ? cell.f ?? cell.v ?? "" : ""))
          );
          mapped = rows.map((row) => {
            const obj = { __isFallback: false };
            cols.forEach((label, idx) => {
              const key = normalize(label);
              obj[key] = row[idx] ?? "";
            });
            return obj;
          });
          const hasKpiCol =
            cols.map((c) => normalize(c)).includes(normalize("KPI")) ||
            cols.map((c) => normalize(c)).includes(normalize("KPI ID"));
          if (!hasKpiCol) {
            setSheetError("KPI column not found. Check sheet headers.");
          }
        } catch {
          mapped = [];
        }

        if (!mapped.length) {
          const csvRes = await fetch(SHEET_CSV_URL);
          const csvText = await csvRes.text();
          if (csvText.includes("<!DOCTYPE html") || csvText.includes("accounts.google.com")) {
            setSheetError("Sheet not public. Enable Anyone with the link to view.");
            setSheetRows([]);
            setSheetLoading(false);
            return;
          }
          const csvRows = parseCSV(csvText);
          const headers = (csvRows[0] || []).map((h) => h.trim());
          mapped = (csvRows.slice(1) || []).map((row) => {
            const obj = { __isFallback: false };
            headers.forEach((label, idx) => {
              const key = normalize(label);
              obj[key] = row[idx] ?? "";
            });
            return obj;
          });
        }

        const filtered = mapped.filter((r) => {
          const hasValues = Object.keys(r).some((k) => k !== "__isFallback" && r[k] !== "");
          const hasKpi = r[normalize("KPI")] || r[normalize("KPI ID")];
          return hasValues && hasKpi;
        });
        const fromRow4 = filtered.slice(2);
        if (isActive) setSheetRows(fromRow4);
      } catch {
        if (isActive) {
          setSheetError("Unable to load KPI sheet data. Make sure the sheet is public.");
        }
      } finally {
        if (isActive) setSheetLoading(false);
      }
    };
    loadSheet();
    return () => { isActive = false; };
  }, [SHEET_URL]);

  // ── ONBOARDING SHEET ───────────────────────────────────────────────────────
  useEffect(() => {
    let isActive = true;
    const loadOnboardingSum = async () => {
      if (isActive) setOnboardingMeta((prev) => ({ ...prev, loading: true, error: "" }));
      try {
        const tq = encodeURIComponent("select *");
        const url = `https://docs.google.com/spreadsheets/d/${ONBOARDING_SHEET_ID}/gviz/tq?gid=${ONBOARDING_SHEET_GID}&tq=${tq}`;
        const res = await fetch(url);
        const text = await res.text();

        if (text.includes("<!DOCTYPE html") || text.includes("accounts.google.com")) {
          if (isActive) {
            setOnboardingMeta({
              loading: false,
              error: "Onboarding sheet not public. Enable Anyone with the link to view.",
              sum: null,
            });
          }
          return;
        }

        const jsonText = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
        const data = JSON.parse(jsonText);
        const rows = data?.table?.rows || [];
        const colIndex = colLettersToIndex(ONBOARDING_SCORE_COLUMN);
        let sum = 0;

        rows.forEach((row) => {
          const cell = row?.c?.[colIndex];
          if (!cell || cell.v === null || cell.v === undefined) return;
          const num = toNumber(cell.v);
          if (num !== null) sum += num;
        });

        if (isActive) {
          setOnboardingMeta({ loading: false, error: "", sum });
        }
      } catch {
        if (isActive) {
          setOnboardingMeta({
            loading: false,
            error: "Unable to load onboarding sheet data.",
            sum: null,
          });
        }
      }
    };
    loadOnboardingSum();
    return () => { isActive = false; };
  }, []);

  // -- EXIT TASKS SHEET --------------------------------------------------------
  useEffect(() => {
    let isActive = true;
    const loadExitSum = async () => {
      if (isActive) setExitMeta((prev) => ({ ...prev, loading: true, error: "" }));
      try {
        const tq = encodeURIComponent("select *");
        const url = `https://docs.google.com/spreadsheets/d/${EXIT_SHEET_ID}/gviz/tq?gid=${EXIT_SHEET_GID}&tq=${tq}`;
        const res = await fetch(url);
        const text = await res.text();

        if (text.includes("<!DOCTYPE html") || text.includes("accounts.google.com")) {
          throw new Error("Exit sheet not public");
        }

        const jsonText = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
        const data = JSON.parse(jsonText);
        const rows = data?.table?.rows || [];
        const colIndex = colLettersToIndex(EXIT_SCORE_COLUMN);
        let sum = 0;

        rows.forEach((row) => {
          const cell = row?.c?.[colIndex];
          if (!cell || cell.v === null || cell.v === undefined) return;
          const num = toNumber(cell.v);
          if (num !== null) sum += num;
        });

        if (isActive) {
          setExitMeta({ loading: false, error: "", sum });
        }
      } catch {
        try {
          const csvRes = await fetch(EXIT_SHEET_CSV_URL);
          const csvText = await csvRes.text();
          if (csvText.includes("<!DOCTYPE html") || csvText.includes("accounts.google.com")) {
            if (isActive) {
              setExitMeta({
                loading: false,
                error: "Exit sheet not public. Enable Anyone with the link to view.",
                sum: null,
              });
            }
            return;
          }
          const csvRows = parseCSV(csvText);
          const colIndex = colLettersToIndex(EXIT_SCORE_COLUMN);
          let sum = 0;
          (csvRows.slice(1) || []).forEach((row) => {
            const value = row?.[colIndex];
            const num = toNumber(value);
            if (num !== null) sum += num;
          });
          if (isActive) {
            setExitMeta({ loading: false, error: "", sum });
          }
        } catch {
          if (isActive) {
            setExitMeta({
              loading: false,
              error: "Unable to load exit sheet data.",
              sum: null,
            });
          }
        }
      }
    };
    loadExitSum();
    return () => { isActive = false; };
  }, []);

  // ── HIRING SHEET ───────────────────────────────────────────────────────────
  useEffect(() => {
    let isActive = true;
    const loadHiringSheet = async () => {
      setHiringMeta((prev) => ({ ...prev, loading: true, error: "" }));
      setHiringExperiencedMeta((prev) => ({ ...prev, loading: true, error: "" }));
      try {
        const res = await fetch(HIRING_SHEET_CSV_URL);
        const text = await res.text();
        if (text.includes("<!DOCTYPE html") || text.includes("accounts.google.com")) {
          if (isActive) {
            setHiringMeta((prev) => ({
              ...prev,
              loading: false,
              error: "Hiring sheet not public. Enable Anyone with the link to view.",
            }));
            setHiringExperiencedMeta((prev) => ({
              ...prev,
              loading: false,
              error: "Hiring sheet not public. Enable Anyone with the link to view.",
            }));
          }
          return;
        }

        const csvRows = parseCSV(text);
        const dataRows = (csvRows.slice(1) || []).filter((row) =>
          row.some((cell) => (cell || "").toString().trim() !== "")
        );

        // ── DEBUG: log first 3 rows of col AD to verify format ─────────────
        // Remove this block after confirming the score is correct
        console.log("=== HIRING SHEET DEBUG ===");
        console.log("Total rows:", dataRows.length);
        console.log("Col AD (index 29) first 5 rows:");
        dataRows.slice(0, 5).forEach((row, i) => {
          console.log(`  Row ${i + 1}:`, getCsvCell(row, 29));
        });
        console.log("Rows containing 'joined':", dataRows.filter((r) => isJoined(getCsvCell(r, 29))).length);

        // ── DATE WINDOW based on hiringPeriod ──────────────────────────────
        const now = new Date();
        let windowStart, windowEnd;

        if (hiringPeriod === "monthly") {
          windowStart = new Date(now.getFullYear(), now.getMonth(), 1);
          windowEnd = now;
        } else if (hiringPeriod === "quarterly") {
          const q = Math.floor(now.getMonth() / 3);
          windowStart = new Date(now.getFullYear(), q * 3, 1);
          windowEnd = now;
        } else if (hiringPeriod === "annually") {
          windowStart = new Date(now.getFullYear(), 0, 1);
          windowEnd = now;
        } else {
          // weekly � Mon to Sun
          const day = now.getDay() === 0 ? 7 : now.getDay();
          windowStart = new Date(now);
          windowStart.setDate(now.getDate() - (day - 1));
          windowStart.setHours(0, 0, 0, 0);
          windowEnd = new Date(windowStart);
          windowEnd.setDate(windowStart.getDate() + 6);
          windowEnd.setHours(23, 59, 59, 999);
        }

        console.log(`Period: ${hiringPeriod} | Window: ${windowStart.toDateString()} → ${windowEnd.toDateString()}`);

        // ── Col indexes ────────────────────────────────────────────────────
        // Col B  = index 1  → Request Date (process start)
        // Col I  = index 8  → Joining Days ("20 days = joining at 0 days notice...")
        // Col O  = index 14 → Planned Joining Date (deadline)
        // Col AD = index 29 → Hiring History (contains "Joined" status)

        const fresherScores = [];
        const experiencedScores = [];
        let fresherStartDate = "";
        let fresherPlannedDate = "";
        let fresherActualValue = "";
        let fresherKpiDays = "";
        let experiencedStartDate = "";
        let experiencedPlannedDate = "";
        let experiencedActualValue = "";
        let experiencedKpiDays = "";

        dataRows.forEach((row, rowIndex) => {
          const hiringHistory = getCsvCell(row, 29); // Col AD

          // Skip rows that don't have "joined" anywhere in history
          if (!isJoined(hiringHistory)) return;

          // Extract actual joining date from history text
          const actualJoinDate = extractJoinedDateFromHistory(hiringHistory);

          if (!actualJoinDate || isNaN(actualJoinDate)) {
            console.log(`Row ${rowIndex + 2}: Has "joined" but could not parse date from:`, hiringHistory);
            return;
          }

          // Filter: only include if joining date is inside the selected window
          if (actualJoinDate < windowStart || actualJoinDate > windowEnd) {
            console.log(`Row ${rowIndex + 2}: Joined on ${actualJoinDate.toDateString()} — outside window, skipping`);
            return;
          }

          const requestDateRaw = getCsvCell(row, 1);  // Col B — start date
          const joiningDaysRaw = getCsvCell(row, 8);  // Col I — fresher/experienced + target days
          const plannedJoinRaw = getCsvCell(row, 14); // Col O — planned joining

          const joinInfo = normalize(joiningDaysRaw);
          const isFresher = joinInfo.includes("fresher") || joinInfo.includes("new");
          const isExperienced = joinInfo.includes("experienced");
          if (!isFresher && !isExperienced) {
            // If the row isn't tagged, skip to avoid misclassification
            return;
          }

          const requestDate = parseTextDate(requestDateRaw);
          const plannedJoinDate = parseTextDate(plannedJoinRaw);

          // Extract target days from Col I — first number in the text
          // e.g. "20 days = joining at 0 days notice = 8,8,4,0" → 20
          const targetMatch = joiningDaysRaw.toString().match(/^(\d+)/);
          const targetDays = targetMatch ? parseInt(targetMatch[1]) : 20;

          if (!requestDate || isNaN(requestDate)) {
            console.log(`Row ${rowIndex + 2}: Could not parse request date from:`, requestDateRaw);
            return;
          }

          // Actual days = request date (Col B) to actual join date (from Col AD)
          const actualDays = Math.round(
            (actualJoinDate - requestDate) / 86400000
          );

          // Base score = target days - actual days taken
          // Positive = joined faster than target
          // Negative = joined slower than target
          let perHireScore = targetDays - actualDays;

          // Extra penalty if joined after planned joining date (Col O crossed)
          if (plannedJoinDate && !isNaN(plannedJoinDate) && actualJoinDate > plannedJoinDate) {
            const daysLate = Math.round(
              (actualJoinDate - plannedJoinDate) / 86400000
            );
            perHireScore = perHireScore - daysLate;
          }

          console.log(`Row ${rowIndex + 2}: target=${targetDays} actual=${actualDays} score=${perHireScore} joined=${actualJoinDate.toDateString()}`);

          if (isFresher) {
            fresherScores.push(perHireScore);
            if (!fresherStartDate) fresherStartDate = requestDateRaw;
            if (!fresherPlannedDate) fresherPlannedDate = plannedJoinRaw;
            if (!fresherActualValue) fresherActualValue = actualJoinDate.toLocaleDateString("en-GB");
            if (!fresherKpiDays) fresherKpiDays = joiningDaysRaw;
          }
          if (isExperienced) {
            experiencedScores.push(perHireScore);
            if (!experiencedStartDate) experiencedStartDate = requestDateRaw;
            if (!experiencedPlannedDate) experiencedPlannedDate = plannedJoinRaw;
            if (!experiencedActualValue) experiencedActualValue = actualJoinDate.toLocaleDateString("en-GB");
            if (!experiencedKpiDays) experiencedKpiDays = joiningDaysRaw;
          }
        });

        console.log(`Fresher scores: [${fresherScores.join(", ")}]`);
        console.log(`Experienced scores: [${experiencedScores.join(", ")}]`);

        const fresherAvg =
          fresherScores.length > 0
            ? Math.round(fresherScores.reduce((a, b) => a + b, 0) / fresherScores.length)
            : null;
        const experiencedAvg =
          experiencedScores.length > 0
            ? Math.round(experiencedScores.reduce((a, b) => a + b, 0) / experiencedScores.length)
            : null;

        console.log(`Fresher avg score: ${fresherAvg} (from ${fresherScores.length} hires)`);
        console.log(`Experienced avg score: ${experiencedAvg} (from ${experiencedScores.length} hires)`);

        if (isActive) {
          setHiringMeta({
            loading: false,
            error: "",
            cumulativeScore: fresherAvg,
            startDate: fresherStartDate,
            plannedDate: fresherPlannedDate,
            actualValue: fresherActualValue,
            kpiDays: fresherKpiDays,
            joinedCount: fresherScores.length,
          });
          setHiringExperiencedMeta({
            loading: false,
            error: "",
            cumulativeScore: experiencedAvg,
            startDate: experiencedStartDate,
            plannedDate: experiencedPlannedDate,
            actualValue: experiencedActualValue,
            kpiDays: experiencedKpiDays,
            joinedCount: experiencedScores.length,
          });
        }
      } catch (err) {
        console.error("Hiring sheet load error:", err);
        if (isActive) {
          setHiringMeta((prev) => ({
            ...prev,
            loading: false,
            error: "Unable to load hiring sheet data. Make sure the sheet is public.",
          }));
          setHiringExperiencedMeta((prev) => ({
            ...prev,
            loading: false,
            error: "Unable to load hiring sheet data. Make sure the sheet is public.",
          }));
        }
      }
    };
    loadHiringSheet();
    return () => { isActive = false; };
  }, [HIRING_SHEET_CSV_URL, hiringPeriod]);

  // ── RENEWALS SHEET ─────────────────────────────────────────────────────────
  useEffect(() => {
    let isActive = true;
    const loadRenewals = async () => {
      setRenewalsMeta((prev) => ({ ...prev, loading: true, error: "" }));
      try {
        const [masterRes, logRes] = await Promise.all([
          fetch(RENEWALS_MASTER_CSV_URL),
          fetch(RENEWALS_LOG_CSV_URL),
        ]);
        const masterText = await masterRes.text();
        const logText = await logRes.text();
        if (
          masterText.includes("<!DOCTYPE html") ||
          masterText.includes("accounts.google.com") ||
          logText.includes("<!DOCTYPE html") ||
          logText.includes("accounts.google.com")
        ) {
          if (isActive) {
            setRenewalsMeta({
              loading: false,
              error: "Renewals sheet not public. Enable Anyone with the link to view.",
              cumulativeScore: null,
            });
          }
          return;
        }
        const masterRows = parseCSV(masterText).slice(1);
        const logRows = parseCSV(logText).slice(1);

        const masterItems = masterRows
          .filter((row) => row.some((cell) => (cell || "").toString().trim() !== ""))
          .map((row) => ({
            itemId: getCsvCell(row, 0),
            plannedBase: getCsvCell(row, 9),
            frequency: getCsvCell(row, 10),
          }))
          .filter((row) => row.itemId);

        const logByItem = {};
        logRows
          .filter((row) => row.some((cell) => (cell || "").toString().trim() !== ""))
          .forEach((row) => {
            const itemId = getCsvCell(row, 2);
            if (!itemId) return;
            const planned = getCsvCell(row, 7);
            const actual = getCsvCell(row, 6);
            const actualDate = toDate(actual);
            const plannedDate = toDate(planned);
            const referenceDate = actualDate || plannedDate;
            if (!referenceDate) return;
            const existing = logByItem[itemId];
            if (!existing || referenceDate > existing.referenceDate) {
              logByItem[itemId] = { planned, actual, referenceDate };
            }
          });

        const todayDate = new Date();
        let totalScore = 0;
        masterItems.forEach((item) => {
          const logEntry = logByItem[item.itemId];
          if (logEntry) {
            const plannedDate = toDate(logEntry.planned);
            const actualDate = toDate(logEntry.actual);
            if (!plannedDate || !actualDate) return;
            const daysLate = diffInDays(plannedDate, actualDate);
            if (daysLate > 0) totalScore -= daysLate;
            return;
          }
          const baseDate = toDate(item.plannedBase);
          if (!baseDate) return;
          const freq = normalize(item.frequency);
          let plannedDate = baseDate;
          if (freq.includes("monthly")) plannedDate = addMonths(baseDate, 1);
          else if (freq.includes("quarterly")) plannedDate = addMonths(baseDate, 3);
          else if (freq.includes("half")) plannedDate = addMonths(baseDate, 6);
  
          const daysOverdue = diffInDays(plannedDate, todayDate);
          if (daysOverdue > 0) totalScore -= daysOverdue;
        });

        if (isActive) {
          setRenewalsMeta({
            loading: false,
            error: "",
            cumulativeScore: masterItems.length ? totalScore : null,
          });
        }
      } catch {
        if (isActive) {
          setRenewalsMeta({
            loading: false,
            error: "Unable to load renewals sheet data.",
            cumulativeScore: null,
          });
        }
      }
    };
    loadRenewals();
    return () => { isActive = false; };
  }, [RENEWALS_MASTER_CSV_URL, RENEWALS_LOG_CSV_URL]);

  // ── CLEANING SHEET ─────────────────────────────────────────────────────────
  useEffect(() => {
    let isActive = true;
    const loadCleaningStatus = async () => {
      try {
        const res = await fetch(CLEANING_SHEET_CSV_URL);
        const text = await res.text();
        if (text.includes("<!DOCTYPE html") || text.includes("accounts.google.com")) {
          if (isActive) setCleaningStatusToday("");
          return;
        }
        const csvRows = parseCSV(text);
        const dataRows = (csvRows.slice(1) || []).filter((row) =>
          row.some((cell) => (cell || "").toString().trim() !== "")
        );
        const todayKey = normalizeDateKey(new Date().toISOString().slice(0, 10));
        let latestStatus = "";
        for (let i = dataRows.length - 1; i >= 0; i--) {
          const row = dataRows[i];
          const dateValue = normalizeDateKey(getCsvCell(row, 0));
          if (dateValue && dateValue === todayKey) {
            latestStatus = getCsvCell(row, 2);
            break;
          }
        }
        if (isActive) setCleaningStatusToday(latestStatus);
      } catch {
        if (isActive) setCleaningStatusToday("");
      }
    };
    loadCleaningStatus();
    return () => { isActive = false; };
  }, [CLEANING_SHEET_CSV_URL]);

  // ── BOARD MEETING SHEET ────────────────────────────────────────────────────
  useEffect(() => {
    let isActive = true;
    const loadBoardMeetingStatus = async () => {
      try {
        const res = await fetch(BOARD_MEETING_SHEET_CSV_URL);
        const text = await res.text();
        if (text.includes("<!DOCTYPE html") || text.includes("accounts.google.com")) {
          if (isActive) {
            setBoardMeetingMeta({ status: "", lastDateKey: "", canUpdate: true });
          }
          return;
        }
        const csvRows = parseCSV(text);
        const dataRows = (csvRows.slice(1) || []).filter((row) =>
          row.some((cell) => (cell || "").toString().trim() !== "")
        );
        let latestStatus = "";
        let latestDateKey = "";
        for (let i = dataRows.length - 1; i >= 0; i--) {
          const row = dataRows[i];
          const dateValue = normalizeDateKey(getCsvCell(row, 0));
          if (dateValue) {
            latestDateKey = dateValue;
            latestStatus = getCsvCell(row, 2);
            break;
          }
        }
        const lastDate = dateKeyToDate(latestDateKey);
        const todayDate = new Date();
        const canUpdate = lastDate ? todayDate >= addMonths(lastDate, 3) : true;
        if (isActive) {
          setBoardMeetingMeta({
            status: latestStatus,
            lastDateKey: latestDateKey,
            canUpdate,
          });
        }
      } catch {
        if (isActive) {
          setBoardMeetingMeta({ status: "", lastDateKey: "", canUpdate: true });
        }
      }
    };
    loadBoardMeetingStatus();
    return () => { isActive = false; };
  }, [BOARD_MEETING_SHEET_CSV_URL]);

  const rowsToRender = sheetRows.length ? sheetRows : [];
  const filteredRows = rowsToRender.filter((row, idx) => {
    const kpiName = getField(row, "KPI", "kpi");
    const department = getField(row, "Department", "department");
    const createdDate = getField(row, "Created Date", "createdDate");
    const startDate = getField(row, "Start Date (if any)", "startDate");
    const roleValue = getField(row, ["KPI Role", "Role"], "role");
    const roleNames = roleNameMap[normalize(roleValue)] || [];
    const rowKey = getField(row, "KPI ID", "kpiId") || kpiName || `row-${idx}`;
    const assignedToValue = assignedOverrides[rowKey] ?? (roleNames[0] || "-");
    const assignedDesignation = nameDesignationMap[normalize(assignedToValue)];
    const assignedToLabel = assignedDesignation ? `${assignedToValue} - ${assignedDesignation}` : assignedToValue;
    const matchesSearch = filters.search
      ? normalize(kpiName).includes(normalize(filters.search))
      : true;
    const matchesDepartment =
      filters.department && filters.department !== "All Departments"
        ? normalize(department) === normalize(filters.department)
        : true;
    const matchesEmployee =
      filters.employee && filters.employee !== "All Employees"
        ? normalize(assignedToLabel) === normalize(filters.employee)
        : true;
    const fromKey = normalizeDateKey(filters.dateFrom);
    const toKey = normalizeDateKey(filters.dateTo);
    const rowDateKeys = [createdDate, startDate]
      .map((value) => normalizeDateKey(value))
      .filter(Boolean);
    const matchesDate = fromKey || toKey
      ? rowDateKeys.some((key) => {
          if (fromKey && toKey) return key >= fromKey && key <= toKey;
          if (fromKey) return key >= fromKey;
          return key <= toKey;
        })
      : true;
    return matchesSearch && matchesDepartment && matchesEmployee && matchesDate;
  });

  const totalRows = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRows = filteredRows.slice(startIndex, endIndex);
  const startRow = totalRows === 0 ? 0 : startIndex + 1;
  const endRow = Math.min(endIndex, totalRows);

  const departmentOptions = Array.from(
    new Set(
      rowsToRender
        .map((row) => getField(row, "Department", "department"))
        .filter((value) => value)
        .map((value) => value.toString().trim())
    )
  ).sort((a, b) => a.localeCompare(b));

  const employeeOptions = Array.from(
    new Set(
      (allAssignableNames || [])
        .filter((value) => value)
        .map((name) => {
          const designation = nameDesignationMap[normalize(name)] || "";
          return designation ? `${name} - ${designation}` : name;
        })
    )
  ).sort((a, b) => a.toString().localeCompare(b.toString()));

  const getRowScoreValue = (row) => {
    const kpiName = getField(row, "KPI", "kpi");
    const isHiringKpi = normalize(kpiName) === normalize(HIRING_KPI_NAME);
    const isHiringExperiencedKpi = normalize(kpiName) === normalize(HIRING_EXPERIENCED_KPI_NAME);
    const isRenewalsKpi = normalize(kpiName) === normalize("Renewals & Warranties on time");
    const isOnboardingKpi = normalize(kpiName) === normalize(ONBOARDING_KPI_NAME);
    const isExitKpi = normalize(kpiName) === normalize(EXIT_KPI_NAME);
    const baseScore = getField(row, "Score", "score");
    if (isHiringKpi) {
      if (hiringMeta.loading) return "Loading...";
      // ── FIX: return "-" instead of baseScore when no hires found ──────────
      return hiringMeta.cumulativeScore !== null ? formatScore(hiringMeta.cumulativeScore) : "-";
    }
    if (isHiringExperiencedKpi) {
      if (hiringExperiencedMeta.loading) return "Loading...";
      return hiringExperiencedMeta.cumulativeScore !== null ? formatScore(hiringExperiencedMeta.cumulativeScore) : "-";
    }
    if (isRenewalsKpi) {
      if (renewalsMeta.loading) return "Loading...";
      return renewalsMeta.cumulativeScore !== null ? formatScore(renewalsMeta.cumulativeScore) : baseScore;
    }
    if (isOnboardingKpi) {
      if (onboardingMeta.loading) return "Loading...";
      if (onboardingMeta.error) return "Unavailable";
      return onboardingMeta.sum !== null ? onboardingMeta.sum.toLocaleString() : baseScore;
    }
    if (isExitKpi) {
      if (exitMeta.loading) return "Loading...";
      if (exitMeta.error) return "Unavailable";
      return exitMeta.sum !== null ? exitMeta.sum.toLocaleString() : baseScore;
    }
    return baseScore;
  };

  const departmentSummary = Array.from(
    filteredRows.reduce((acc, row) => {
      const dept = getField(row, "Department", "department") || "Unassigned";
      const scoreValue = getRowScoreValue(row);
      const scoreNum = toNumber(scoreValue) ?? 0;
      const entry = acc.get(dept) || { department: dept, totalScore: 0, totalKpis: 0 };
      entry.totalScore += scoreNum;
      entry.totalKpis += 1;
      acc.set(dept, entry);
      return acc;
    }, new Map()).values()
  ).sort((a, b) => a.department.localeCompare(b.department));

  return (
    <div style={page}>
      <div style={shell}>
        {/* Header */}
        <header style={header}>
          <div>
            <h1 style={title}>KPI Dashboard</h1>
            <div style={subtitle}>Monitor scoring and KPI progress in one place.</div>
          </div>
          <div style={headerActions}>
            <button style={ghostBtn}>Export</button>
            <button onClick={() => setShowForm(true)} style={primaryBtn}>
              Add KPI
            </button>
          </div>
        </header>

        {/* Filters and Table */}
        <section style={contentGrid}>
          <div style={panel}>
            <div style={panelHeader}>
              <div>
                <div style={panelTitle}>KPI Tracker</div>
                <div style={panelHint}>Live status based on latest scoring inputs.</div>
              </div>
            </div>
            {sheetLoading && <div style={panelHint}>Loading KPI sheet data...</div>}
            {sheetError && <div style={{ ...panelHint, color: "#b91c1c" }}>{sheetError}</div>}
            {hiringMeta.error && <div style={{ ...panelHint, color: "#b91c1c" }}>{hiringMeta.error}</div>}
            {hiringExperiencedMeta.error && <div style={{ ...panelHint, color: "#b91c1c" }}>{hiringExperiencedMeta.error}</div>}
            {renewalsMeta.error && <div style={{ ...panelHint, color: "#b91c1c" }}>{renewalsMeta.error}</div>}
            {onboardingMeta.error && <div style={{ ...panelHint, color: "#b91c1c" }}>{onboardingMeta.error}</div>}
            {exitMeta.error && <div style={{ ...panelHint, color: "#b91c1c" }}>{exitMeta.error}</div>}
            {!sheetLoading && !sheetError && rowsToRender.length === 0 && (
              <div style={panelHint}>No KPI rows found in the sheet.</div>
            )}
            {!sheetLoading && !sheetError && rowsToRender.length > 0 && filteredRows.length === 0 && (
              <div style={panelHint}>No KPI rows match the selected filters.</div>
            )}

            {departmentSummary.length > 0 && (
              <div style={deptCardsGrid}>
                {departmentSummary.map((dept) => {
                  const avgScore = dept.totalKpis ? dept.totalScore / dept.totalKpis : 0;
                  const avgScoreWhole = Math.round(avgScore);
                  const palette = getDeptPalette(dept.department);
                  return (
                    <div
                      key={dept.department}
                      style={{
                        ...deptCard,
                        background: `linear-gradient(135deg, #ffffff 0%, ${palette.accent} 100%)`,
                        borderColor: palette.border,
                      }}
                    >
                      <div style={{ ...deptCardTitle, color: palette.text }}>{dept.department}</div>
                      <div style={deptCardValue}>{avgScoreWhole}</div>
                      <div style={deptCardMeta}>Final Score: {avgScoreWhole}</div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={filterRow}>
              <input
                style={filterInput}
                name="search"
                value={filters.search}
                placeholder="Search KPI"
                onChange={handleFilterChange}
              />
              <div style={filterInline}>
                <span style={filterInlineLabel}>From Date</span>
                <input
                  style={filterInput}
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                />
              </div>
              <div style={filterInline}>
                <span style={filterInlineLabel}>To Date</span>
                <input
                  style={filterInput}
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                />
              </div>
              <select
                style={filterInput}
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
              >
                <option>All Departments</option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                style={filterInput}
                name="employee"
                value={filters.employee}
                onChange={handleFilterChange}
              >
                <option>All Employees</option>
                {employeeOptions.map((name) => (
                  <option key={`employee-${name}`} value={name}>{name}</option>
                ))}
              </select>
              <select
                style={{ ...filterInput, flex: "0 0 160px", maxWidth: 180 }}
                value={hiringPeriod}
                onChange={(e) => setHiringPeriod(e.target.value)}
              >
                <option value="" disabled>Frequency</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
                
              </select>
              <button type="button" style={ghostBtn} onClick={clearFilters}>
                Clear Filters
              </button>
            </div>

            <div style={tableWrap}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>KPI</th>
                    <th style={th}>Department</th>
                    <th style={th}>Assigned To</th>
                    <th style={th}>Score</th>
                    <th style={th}>Scoring Scale</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.map((row, idx) => {
                    const kpiName = getField(row, "KPI", "kpi");
                    const rowKey = getField(row, "KPI ID", "kpiId") || kpiName || `row-${idx}`;
                    const roleValue = getField(row, ["KPI Role", "Role"], "role");
                    const roleNames = roleNameMap[normalize(roleValue)] || [];
                    const assignedToValue = assignedOverrides[rowKey] ?? (roleNames[0] || "-");
    const assignedDesignation = nameDesignationMap[normalize(assignedToValue)];
    const assignedToLabel = assignedDesignation ? `${assignedToValue} - ${assignedDesignation}` : assignedToValue;
                    const isHiringKpi = normalize(kpiName) === normalize(HIRING_KPI_NAME);
                    const isHiringExperiencedKpi = normalize(kpiName) === normalize(HIRING_EXPERIENCED_KPI_NAME);
                    const isRenewalsKpi = normalize(kpiName) === normalize("Renewals & Warranties on time");
                    const isOnboardingKpi = normalize(kpiName) === normalize(ONBOARDING_KPI_NAME);
                    const isExitKpi = normalize(kpiName) === normalize(EXIT_KPI_NAME);
                    const hiringMetaForRow = isHiringExperiencedKpi ? hiringExperiencedMeta : hiringMeta;
                    const targetValue = isHiringKpi || isHiringExperiencedKpi
                      ? hiringMetaForRow.kpiDays || getField(row, "KPI Value", "value")
                      : getField(row, ["KPI Value", "Planned"], "value");
                    const actualValue = isHiringKpi || isHiringExperiencedKpi
                      ? hiringMetaForRow.actualValue || getField(row, "Actual Value", "actualValue")
                      : getField(row, ["Actual Value", "Actual"], "actualValue");
                    const baseScore = getField(row, "Score", "score");
                    const scoreValue = isHiringKpi || isHiringExperiencedKpi
                      ? hiringMetaForRow.loading
                        ? "Loading..."
                        : hiringMetaForRow.cumulativeScore !== null
                        ? formatScore(hiringMetaForRow.cumulativeScore)
                        : "-"  // ── FIX: show "-" not wrong base score
                      : isRenewalsKpi
                      ? renewalsMeta.loading
                        ? "Loading..."
                        : renewalsMeta.cumulativeScore !== null
                        ? formatScore(renewalsMeta.cumulativeScore)
                        : baseScore
                      : isOnboardingKpi
                      ? onboardingMeta.loading
                        ? "Loading..."
                        : onboardingMeta.error
                        ? "Unavailable"
                        : onboardingMeta.sum !== null
                        ? onboardingMeta.sum.toLocaleString()
                        : baseScore
                      : isExitKpi
                      ? exitMeta.loading
                        ? "Loading..."
                        : exitMeta.error
                        ? "Unavailable"
                        : exitMeta.sum !== null
                        ? exitMeta.sum.toLocaleString()
                        : baseScore
                      : baseScore;
                    const scoringScaleValue = (isOnboardingKpi || isExitKpi) ? "" : getScoringScale(targetValue, actualValue, scoreValue);
                    const frequencyType = getField(row, "KPI Frequency Type", "frequencyType");
                    const isOfficeCleaning = normalize(kpiName) === normalize(OFFICE_CLEANING_KPI_NAME);
                    const isBoardMeeting = normalize(kpiName) === normalize(BOARD_MEETING_KPI_NAME);
                    const viewRowOverride = isHiringKpi || isHiringExperiencedKpi
                      ? {
                          ...row,
                          __override: true,
                          startDate: hiringMetaForRow.startDate || getField(row, "Start Date (if any)", "startDate"),
                          actualValue: hiringMetaForRow.actualValue || getField(row, "Actual Value", "actualValue"),
                          value: hiringMetaForRow.kpiDays || getField(row, "KPI Value", "value"),
                          score: scoreValue,
                          scoringScale: scoringScaleValue || getField(row, "Scoring Scale", "scoringScale"),
                        }
                      : isRenewalsKpi
                      ? { ...row, __override: true, score: scoreValue }
                      : isOnboardingKpi
                      ? { ...row, __override: true, score: scoreValue }
                      : row;
                    const actionValue = isOfficeCleaning && cleaningStatusToday
                      ? cleaningStatusToday
                      : isBoardMeeting && boardMeetingMeta.status
                      ? boardMeetingMeta.status
                      : getField(row, "Action", "action");
                    return (
                      <tr
                        key={`${kpiName}-${idx}`}
                        style={{ ...tr, cursor: "pointer" }}
                        onClick={() => setViewRow(viewRowOverride)}
                      >
                        <td style={tdStrong}>{kpiName}</td>
                        <td style={td}>{getField(row, "Department", "department") || "-"}</td>
                        <td style={td}>
                        <select
                          style={{ ...filterInput, flex: "0 0 180px", maxWidth: 220, padding: "6px 8px" }}
                          value={assignedToValue}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            setAssignedOverrides((prev) => ({ ...prev, [rowKey]: e.target.value }))
                          }
                        >
                          <option value="-">-</option>
                          {allAssignableNames.map((name) => (
                            <option key={`${rowKey}-${name}`} value={name}>{name}</option>
                          ))}
                        </select>
                      </td>
                        <td style={td}>{scoreValue || "-"}</td>
                        <td style={td}>{scoringScaleValue || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={paginationBar}>
              <div style={paginationLeft}>
                <span style={paginationLabel}>Rows per page</span>
                <select
                  style={{ ...filterInput, flex: "0 0 90px", maxWidth: 100 }}
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span style={paginationInfo}>
                  {totalRows === 0 ? "0" : `${startRow}-${endRow}`} of {totalRows}
                </span>
              </div>
              <div style={paginationRight}>
                <button
                  type="button"
                  style={{ ...pageBtn, opacity: safePage === 1 ? 0.5 : 1 }}
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                >
                  Prev
                </button>
                <span style={paginationInfo}>Page {safePage} of {totalPages}</span>
                <button
                  type="button"
                  style={{ ...pageBtn, opacity: safePage === totalPages ? 0.5 : 1 }}
                  disabled={safePage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Add KPI Form */}
        {showForm && (
          <div style={overlay}>
            <div style={modal}>
              <div style={modalBar}>
                <div style={modalTitle}>Add KPI</div>
              </div>
              <div style={modalBody}>
                <div style={modalHint}>Fill out the details to create a new KPI.</div>
                <form onSubmit={handleSubmit} style={formStack}>
                  <section style={section}>
                    <div style={sectionTitle}>KPI Basics</div>
                    <div style={sectionGrid}>
                      <input style={input} name="kpiId" placeholder="KPI ID" onChange={handleChange} />
                      <input style={{ ...input, background: "#eef2ff" }} name="createdDate" type="date" value={form.createdDate} readOnly />
                      <input style={input} name="createdBy" placeholder="Created By" onChange={handleChange} />
                      <input style={input} name="department" placeholder="Department" onChange={handleChange} />
                      <input style={input} name="process" placeholder="Process" onChange={handleChange} />
                      <input style={input} name="subprocess" placeholder="Subprocess" onChange={handleChange} />
                      <input style={input} name="role" placeholder="KPI Role" onChange={handleChange} />
                      <input style={input} name="kpi" placeholder="KPI Name" onChange={handleChange} />
                      <input style={input} name="description" placeholder="KPI Description" onChange={handleChange} />
                    </div>
                  </section>
                  <section style={section}>
                    <div style={sectionTitle}>Schedule and Frequency</div>
                    <div style={sectionGrid}>
                      <input style={input} type="date" name="startDate" placeholder="Start Date" onChange={handleChange} />
                      <input style={input} type="date" name="expiryDate" placeholder="Expiry Date" onChange={handleChange} />
                      <input style={input} type="date" name="deadline" placeholder="Deadline" onChange={handleChange} />
                      <input style={input} type="datetime-local" name="triggerTime" placeholder="Trigger Time" onChange={handleChange} />
                      <select style={input} name="frequencyType" value={form.frequencyType} onChange={handleChange}>
                        <option value="">KPI Frequency Type</option>
                        <option value="Repetitive">Repetitive</option>
                        <option value="Deadline">Deadline</option>
                      </select>
                      {form.frequencyType === "Repetitive" && (
                        <select style={input} name="action" value={form.action} onChange={handleChange}>
                          <option value="">Action (Yes/No)</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      )}
                      <input style={input} name="scoringFrequency" placeholder="Scoring Frequency" onChange={handleChange} />
                      <input style={input} name="reportingFrequency" placeholder="Reporting Frequency" onChange={handleChange} />
                    </div>
                  </section>
                  <section style={section}>
                    <div style={sectionTitle}>Scoring and Value</div>
                    <div style={sectionGrid}>
                      <input style={input} name="valueType" placeholder="KPI Value Type" onChange={handleChange} />
                      <input style={input} name="value" placeholder="KPI Value" onChange={handleChange} />
                      <input style={input} name="maxMin" placeholder="KPI Max/Min" onChange={handleChange} />
                      <input style={input} name="scoringScale" placeholder="Scoring Scale" onChange={handleChange} />
                      <input style={input} name="carryRule" placeholder="Carry Over Rule" onChange={handleChange} />
                      <input style={input} name="leaveApplicable" placeholder="Applicable During Leave" onChange={handleChange} />
                      <input style={input} name="status" placeholder="KPI Status" onChange={handleChange} />
                      <input style={input} name="cancelReason" placeholder="Reason for Cancelling" onChange={handleChange} />
                      <input style={input} name="updateMethod" placeholder="Update Method" onChange={handleChange} />
                      <input style={input} name="actualSource" placeholder="Actual Value Fetched From" onChange={handleChange} />
                    </div>
                  </section>
                  <div style={formActions}>
                    <button type="button" style={ghostBtn} onClick={() => setShowForm(false)}>Cancel</button>
                    <button type="submit" style={primaryBtn}>Submit KPI</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* View KPI Details */}
        {viewRow && (
          <div style={overlay}>
            <div style={modal}>
              <div style={modalBar}>
                <div style={modalTitle}>KPI Details</div>
              </div>
              <div style={modalBody}>
                <div style={modalHint}>Full KPI details from the selected row.</div>
                <div style={formStack}>
                  <section style={section}>
                    <div style={sectionTitle}>KPI Form</div>
                    <div style={sectionGrid}>
                      <Field label="KPI ID"><input style={readOnlyInput} value={getField(viewRow, "KPI ID", "kpiId")} readOnly /></Field>
                      <Field label="Created Date"><input style={readOnlyInput} value={getField(viewRow, "Created Date", "createdDate")} readOnly /></Field>
                      <Field label="Created By"><input style={readOnlyInput} value={getField(viewRow, "Created By", "createdBy")} readOnly /></Field>
                      <Field label="Department"><input style={readOnlyInput} value={getField(viewRow, "Department", "department")} readOnly /></Field>
                      <Field label="Process"><input style={readOnlyInput} value={getField(viewRow, "Process", "process")} readOnly /></Field>
                      <Field label="Subprocess"><input style={readOnlyInput} value={getField(viewRow, "Subprocess", "subprocess")} readOnly /></Field>
                      <Field label="KPI Role"><input style={readOnlyInput} value={getField(viewRow, "KPI Role", "role")} readOnly /></Field>
                      <Field label="KPI"><input style={readOnlyInput} value={getField(viewRow, "KPI", "kpi")} readOnly /></Field>
                      <Field label="Start Date (if any)"><input style={readOnlyInput} value={getField(viewRow, "Start Date (if any)", "startDate")} readOnly /></Field>
                      <Field label="Expiry Date (if any)"><input style={readOnlyInput} value={getField(viewRow, "Expiry Date (if any)", "expiryDate")} readOnly /></Field>
                      <Field label="KPI Description"><input style={readOnlyInput} value={getField(viewRow, "KPI Description", "description")} readOnly /></Field>
                      <Field label="KPI Frequency Type"><input style={readOnlyInput} value={getField(viewRow, "KPI Frequency Type", "frequencyType")} readOnly /></Field>
                      <Field label="Action (Repetitive)"><input style={readOnlyInput} value={getField(viewRow, "Action", "action")} readOnly /></Field>
                      <Field label="By?"><input style={readOnlyInput} value={getField(viewRow, "By?", "deadline")} readOnly /></Field>
                      <Field label="Deadline Date"><input style={readOnlyInput} value={getField(viewRow, "Deadline Date", "deadline")} readOnly /></Field>
                      <Field label="KPI Value Type"><input style={readOnlyInput} value={getField(viewRow, ["KPI Value Type", "By? KPI Value Type"], "valueType")} readOnly /></Field>
                      <Field label="KPI Value"><input style={readOnlyInput} value={getField(viewRow, "KPI Value", "value")} readOnly /></Field>
                      <Field label="KPI Max/Min"><input style={readOnlyInput} value={getField(viewRow, "KPI Max/Min", "maxMin")} readOnly /></Field>
                      <Field label="Scoring Frequency"><input style={readOnlyInput} value={getField(viewRow, "Scoring Frequency", "scoringFrequency")} readOnly /></Field>
                      <Field label="Scoring Trigger Date & Time"><input style={readOnlyInput} value={getField(viewRow, "Scoring Trigger Date & Time", "triggerTime")} readOnly /></Field>
                      <Field label="Reporting Frequency"><input style={readOnlyInput} value={getField(viewRow, "Reporting Frequency", "reportingFrequency")} readOnly /></Field>
                      <Field label="KPI Carry-Over Rule (For Scoring) ie, is the task pending?"><input style={readOnlyInput} value={getField(viewRow, "KPI Carry-Over Rule (For Scoring) ie, is the task pending?", "carryRule")} readOnly /></Field>
                      <Field label="Applicable During Leave (Employee Score)"><input style={readOnlyInput} value={getField(viewRow, "Applicable During Leave (Employee Score)", "leaveApplicable")} readOnly /></Field>
                      <Field label="KPI Status"><input style={readOnlyInput} value={getField(viewRow, "KPI Status", "status")} readOnly /></Field>
                      <Field label="Reason for Cancelling"><input style={readOnlyInput} value={getField(viewRow, "Reason for Cancelling", "cancelReason")} readOnly /></Field>
                      <Field label="Update Method"><input style={readOnlyInput} value={getField(viewRow, "Update Method", "updateMethod")} readOnly /></Field>
                      <Field label="Actual Value Fetched From"><input style={readOnlyInput} value={getField(viewRow, "Actual Value Fetched From", "actualSource")} readOnly /></Field>
                      <Field label="Scoring Scale"><input style={readOnlyInput} value={getField(viewRow, "Scoring Scale", "scoringScale")} readOnly /></Field>
                      <Field label="Updated On"><input style={readOnlyInput} value={getField(viewRow, "Updated On", "updatedOn")} readOnly /></Field>
                      <Field label="KPI Stage"><input style={readOnlyInput} value={getField(viewRow, "KPI Stage", "kpiStage")} readOnly /></Field>
                      <Field label="Actual Value"><input style={readOnlyInput} value={getField(viewRow, "Actual Value", "actualValue")} readOnly /></Field>
                      <Field label="Score"><input style={readOnlyInput} value={getField(viewRow, "Score", "score")} readOnly /></Field>
                    </div>
                  </section>
                  <div style={formActions}>
                    <button type="button" style={ghostBtn} onClick={() => setViewRow(null)}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Field = ({ label, children }) => (
  <div style={field}>
    <div style={fieldLabel}>{label}</div>
    {children}
  </div>
);

const page = { minHeight: "100vh", background: "radial-gradient(circle at top left, #f6f7ff, #eef2ff 45%, #f8fafc)", padding: 24, fontFamily: '"Poppins", "Segoe UI", sans-serif', color: "#0f172a" };
const shell = { maxWidth: 1200, margin: "0 auto" };
const header = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "22px 26px", background: "linear-gradient(120deg, #0f172a, #1d4ed8)", borderRadius: 18, color: "#ffffff", boxShadow: "0 14px 30px rgba(15, 23, 42, 0.25)" };
const title = { fontSize: 28, fontWeight: 700, margin: "6px 0 4px" };
const subtitle = { fontSize: 14, opacity: 0.9 };
const headerActions = { display: "flex", gap: 12 };
const contentGrid = { display: "grid", gridTemplateColumns: "1fr", gap: 18, marginTop: 20 };
const panel = { background: "#ffffff", borderRadius: 18, padding: 18, boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)" };
const panelHeader = { display: "flex", flexDirection: "column", gap: 12, marginBottom: 14 };
const panelTitle = { fontSize: 18, fontWeight: 700 };
const panelHint = { fontSize: 13, color: "#64748b" };
const filterRow = { display: "flex", flexWrap: "wrap", gap: 10 };
const filterInline = { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" };
const filterInlineLabel = { fontSize: 12, fontWeight: 600, color: "#475569" };
const filterInput = { padding: "10px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13, background: "#f8fafc", flex: "1 1 140px" };


const paginationBar = { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginTop: 12 };
const paginationLeft = { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" };
const paginationRight = { display: "flex", alignItems: "center", gap: 8 };
const paginationLabel = { fontSize: 12, fontWeight: 600, color: "#475569" };
const paginationInfo = { fontSize: 12, color: "#475569" };
const pageBtn = { background: "#ffffff", color: "#1e293b", border: "1px solid #e2e8f0", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 600 };
const tableWrap = { overflowX: "auto", borderRadius: 12, border: "1px solid #eef2ff" };
const deptCardsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 18 };
const deptCard = { background: "linear-gradient(135deg, #ffffff 0%, #f1f5ff 100%)", border: "1px solid #dbeafe", borderRadius: 16, padding: "14px 16px", boxShadow: "0 12px 24px rgba(15, 23, 42, 0.08)", transition: "transform 0.18s ease, box-shadow 0.18s ease" };
const deptCardTitle = { fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#475569", fontWeight: 700 };
const deptCardValue = { fontSize: 26, fontWeight: 800, marginTop: 10, color: "#0f172a" };
const deptCardMeta = { fontSize: 12, marginTop: 8, color: "#64748b" };
const table = { width: "100%", borderCollapse: "collapse", fontSize: 13 };
const th = { textAlign: "left", padding: "12px 14px", background: "#0f172a", color: "#ffffff", fontWeight: 600 };
const tr = { borderBottom: "1px solid #eef2f7" };
const td = { padding: "12px 14px", color: "#475569" };
const tdStrong = { padding: "12px 14px", fontWeight: 600, color: "#0f172a" };
const overlay = { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 18, zIndex: 2000 };
const modal = { width: "min(900px, 94vw)", maxHeight: "90vh", background: "#ffffff", borderRadius: 16, overflow: "hidden", boxShadow: "0 30px 60px rgba(15, 23, 42, 0.25)" };
const modalBar = { background: "#1d4ed8", color: "#ffffff", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" };
const modalTitle = { fontSize: 18, fontWeight: 700 };
const modalBody = { padding: 20, overflowY: "auto", maxHeight: "calc(90vh - 60px)" };
const modalHint = { fontSize: 13, color: "#64748b", marginBottom: 14 };
const formStack = { display: "flex", flexDirection: "column", gap: 16 };
const section = { border: "1px solid #e2e8f0", borderRadius: 12, padding: 14, background: "#f8fafc" };
const sectionTitle = { fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 };
const sectionGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 };
const field = { display: "flex", flexDirection: "column", gap: 6 };
const fieldLabel = { fontSize: 12, fontWeight: 600, color: "#475569" };
const input = { padding: "12px 12px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#ffffff", fontSize: 13 };
const readOnlyInput = { padding: "12px 12px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: 13, color: "#475569" };
const formActions = { display: "flex", justifyContent: "flex-end", gap: 10 };
const primaryBtn = { background: "linear-gradient(120deg, #2563eb, #1d4ed8)", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontWeight: 600, boxShadow: "0 10px 18px rgba(37, 99, 235, 0.25)" };
const ghostBtn = { background: "#ffffff", color: "#1e293b", border: "1px solid #e2e8f0", padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontWeight: 600 };




















