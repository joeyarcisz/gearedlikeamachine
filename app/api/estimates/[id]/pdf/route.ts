import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
  Font,
} from "@react-pdf/renderer";
import type { CatalogCategory, RateType } from "@prisma/client";

async function authorize() {
  const cookieStore = await cookies();
  const token = cookieStore.get("glm_admin_token")?.value;
  if (!token || !(await validateAdminSession(token))) {
    return false;
  }
  return true;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 16,
  },
  logoText: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 3,
  },
  logoSub: {
    fontSize: 8,
    letterSpacing: 3,
    color: "#999999",
    marginTop: 2,
  },
  headerRight: {
    textAlign: "right",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
  },
  headerMeta: {
    fontSize: 10,
    color: "#999999",
    marginTop: 3,
  },
  clientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  clientLabel: {
    fontSize: 8,
    letterSpacing: 2,
    color: "#999999",
    marginBottom: 3,
  },
  clientName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  clientCompany: {
    fontSize: 10,
    color: "#666666",
  },
  projectInfo: {
    fontSize: 10,
    color: "#666666",
  },
  sectionHeader: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 6,
    marginTop: 16,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 3,
  },
  colName: { width: "40%", color: "#666666" },
  colRate: { width: "18%", textAlign: "right", color: "#666666" },
  colQty: { width: "12%", textAlign: "center", color: "#666666" },
  colDays: { width: "12%", textAlign: "center", color: "#666666" },
  colTotal: { width: "18%", textAlign: "right", fontFamily: "Helvetica-Bold" },
  sectionSubtotal: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginBottom: 4,
  },
  subtotalText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  totalsContainer: {
    borderTopWidth: 2,
    borderTopColor: "#1a1a1a",
    paddingTop: 12,
    marginTop: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalLabel: { fontSize: 10, color: "#666666" },
  totalValue: { fontSize: 10 },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 8,
    marginTop: 4,
  },
  grandTotalLabel: { fontSize: 14, fontFamily: "Helvetica-Bold", letterSpacing: 1 },
  grandTotalValue: { fontSize: 14, fontFamily: "Helvetica-Bold" },
  footer: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  footerNotes: {
    fontSize: 9,
    color: "#999999",
    lineHeight: 1.6,
    marginBottom: 8,
  },
  footerTerms: {
    fontSize: 8,
    color: "#999999",
    lineHeight: 1.6,
  },
  footerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  footerCompany: { fontSize: 8, color: "#999999" },
  footerPage: { fontSize: 8, color: "#999999" },
});

const CATEGORY_DISPLAY: Record<CatalogCategory, string> = {
  PRE_PRO: "Pre-Production",
  CREW: "Production Crew",
  GEAR: "Equipment",
  POST: "Post-Production",
  TRAVEL: "Travel",
};

const CATEGORY_ORDER: CatalogCategory[] = ["PRE_PRO", "CREW", "GEAR", "POST", "TRAVEL"];

function rateSuffix(rateType: RateType): string {
  switch (rateType) {
    case "DAY": return "/day";
    case "HOUR": return "/hr";
    case "PER_MILE": return "/mi";
    case "FLAT": return "";
  }
}

function formatCurrency(cents_or_dollars: number): string {
  return `$${cents_or_dollars.toLocaleString("en-US")}`;
}

function formatRate(unitRate: number, rateType: RateType): string {
  if (rateType === "PER_MILE") {
    return `$${(unitRate / 100).toFixed(2)}${rateSuffix(rateType)}`;
  }
  return `${formatCurrency(unitRate)}${rateSuffix(rateType)}`;
}

type LineItem = {
  name: string;
  category: CatalogCategory;
  rateType: RateType;
  unitRate: number;
  quantity: number;
  days: number;
  lineTotal: number;
};

type EstimateData = {
  estimateNumber: string;
  title: string;
  shootDays: number | null;
  validUntil: Date | null;
  clientNotes: string | null;
  total: number;
  contact: { name: string; company: string | null } | null;
  lineItems: LineItem[];
};

function buildEstimatePDF(data: EstimateData) {
  const grouped = CATEGORY_ORDER
    .map((cat) => ({
      category: cat,
      label: CATEGORY_DISPLAY[cat],
      items: data.lineItems.filter((li) => li.category === cat),
      subtotal: data.lineItems
        .filter((li) => li.category === cat)
        .reduce((sum, li) => sum + li.lineTotal, 0),
    }))
    .filter((g) => g.items.length > 0);

  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const validStr = data.validUntil
    ? new Date(data.validUntil).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "LETTER", style: styles.page },

      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.logoText }, "GLM"),
          React.createElement(Text, { style: styles.logoSub }, "GEARED LIKE A MACHINE")
        ),
        React.createElement(
          View,
          { style: styles.headerRight },
          React.createElement(Text, { style: styles.headerTitle }, "PRODUCTION ESTIMATE"),
          React.createElement(Text, { style: styles.headerMeta }, data.estimateNumber),
          React.createElement(Text, { style: styles.headerMeta }, dateStr)
        )
      ),

      // Client Info
      React.createElement(
        View,
        { style: styles.clientRow },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.clientLabel }, "PREPARED FOR"),
          data.contact
            ? React.createElement(
                View,
                null,
                React.createElement(Text, { style: styles.clientName }, data.contact.name),
                data.contact.company
                  ? React.createElement(Text, { style: styles.clientCompany }, data.contact.company)
                  : null
              )
            : React.createElement(Text, { style: styles.clientCompany }, "Client TBD")
        ),
        React.createElement(
          View,
          { style: { textAlign: "right" } },
          React.createElement(Text, { style: styles.clientLabel }, "PROJECT"),
          React.createElement(Text, { style: styles.clientName }, data.title),
          React.createElement(
            Text,
            { style: styles.projectInfo },
            [
              data.shootDays ? `${data.shootDays} shoot day${data.shootDays > 1 ? "s" : ""}` : null,
              validStr ? `Valid until ${validStr}` : null,
            ]
              .filter(Boolean)
              .join(" · ")
          )
        )
      ),

      // Line Item Sections
      ...grouped.map((group) =>
        React.createElement(
          View,
          { key: group.category },
          React.createElement(Text, { style: styles.sectionHeader }, group.label.toUpperCase()),
          ...group.items.map((item, idx) =>
            React.createElement(
              View,
              { style: styles.tableRow, key: `${group.category}-${idx}` },
              React.createElement(Text, { style: styles.colName }, item.name),
              React.createElement(Text, { style: styles.colRate }, formatRate(item.unitRate, item.rateType)),
              React.createElement(
                Text,
                { style: styles.colQty },
                item.rateType === "HOUR" ? `${item.quantity} hrs` : `x${item.quantity}`
              ),
              React.createElement(
                Text,
                { style: styles.colDays },
                item.rateType === "PER_MILE"
                  ? `${item.days} day${item.days > 1 ? "s" : ""}`
                  : `${item.days} day${item.days > 1 ? "s" : ""}`
              ),
              React.createElement(Text, { style: styles.colTotal }, formatCurrency(item.lineTotal))
            )
          ),
          React.createElement(
            View,
            { style: styles.sectionSubtotal },
            React.createElement(Text, { style: styles.subtotalText }, formatCurrency(group.subtotal))
          )
        )
      ),

      // Totals
      React.createElement(
        View,
        { style: styles.totalsContainer },
        ...grouped.map((group) =>
          React.createElement(
            View,
            { style: styles.totalRow, key: `total-${group.category}` },
            React.createElement(Text, { style: styles.totalLabel }, group.label),
            React.createElement(Text, { style: styles.totalValue }, formatCurrency(group.subtotal))
          )
        ),
        React.createElement(
          View,
          { style: styles.grandTotalRow },
          React.createElement(Text, { style: styles.grandTotalLabel }, "TOTAL"),
          React.createElement(Text, { style: styles.grandTotalValue }, formatCurrency(data.total))
        )
      ),

      // Footer
      React.createElement(
        View,
        { style: styles.footer },
        data.clientNotes
          ? React.createElement(Text, { style: styles.footerNotes }, data.clientNotes)
          : null,
        React.createElement(
          Text,
          { style: styles.footerTerms },
          "Estimate valid for 30 days. 50% deposit required to book dates. Final invoice due net-15 upon delivery. Travel and per diems billed at cost. This estimate does not include talent fees, location permits, or music licensing unless listed above."
        ),
        React.createElement(
          View,
          { style: styles.footerBottom },
          React.createElement(
            Text,
            { style: styles.footerCompany },
            "Geared Like A Machine LLC · Dallas, TX · gearedlikeamachine.com"
          ),
          React.createElement(
            Text,
            { style: styles.footerPage, render: ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => `Page ${pageNumber} of ${totalPages}` },
          )
        )
      )
    )
  );
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const estimate = await prisma.estimate.findUnique({
      where: { id },
      include: {
        contact: { select: { name: true, company: true } },
        lineItems: {
          orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
        },
      },
    });

    if (!estimate) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    const pdfDoc = buildEstimatePDF({
      estimateNumber: estimate.estimateNumber,
      title: estimate.title,
      shootDays: estimate.shootDays,
      validUntil: estimate.validUntil,
      clientNotes: estimate.clientNotes,
      total: estimate.total,
      contact: estimate.contact,
      lineItems: estimate.lineItems,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(pdfDoc as any);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${estimate.estimateNumber}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
