import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../src/createApp";
import { signToken } from "../src/utils/jwt";

vi.mock("../src/services/authService", () => ({
  validateAdmin: vi.fn()
}));

vi.mock("../src/services/siteContentService", () => ({
  getSiteContent: vi.fn(),
  updateSiteContent: vi.fn(),
  updateSiteSection: vi.fn()
}));

vi.mock("../src/services/packageInquiryService", () => ({
  createPackageInquiry: vi.fn(),
}));

import { validateAdmin } from "../src/services/authService";
import { createPackageInquiry } from "../src/services/packageInquiryService";
import { getSiteContent, updateSiteContent, updateSiteSection } from "../src/services/siteContentService";

const app = createApp();

const sampleContent = {
  hero: { backgroundImage: "", badge: "b", titleLine1: "a", titleLine2: "b", titleLine3: "c", subtitle: "d", ctaPrimary: "e", ctaSecondary: "f", stats: [{ value: "1", label: "A" }] },
  partners: [{ id: "1", name: "ICT" }],
  about: { eventDate: "date", location: "loc", venue: "venue", visualImage: "", paragraph1: "p1", paragraph2: "p2", bullets: ["x"], dates: [{ value: "v", label: "l" }] },
  why: { description: "desc", items: [{ id: "1", number: "01", iconType: "eye", title: "t", description: "d" }], stats: [{ value: "1", label: "l" }] },
  packages: [{ id: "1", badge: "b", price: "1", currency: "RWF", slots: 1, featured: false, benefits: ["x"], ctaText: "go" }],
  cta: { label: "l", backgroundWatermark: "wm", title: "t", titleEmphasis: "te", subtitle: "s", primaryCta: "p", primaryHref: "#", secondaryCta: "s", secondaryHref: "#", contactEmail: "a@b.com", contactPhone: "+1" },
  footer: { tagline: "t", socials: [{ label: "x", href: "#" }], columns: [{ title: "c", links: [{ label: "l", href: "#" }] }], copyright: "c", madeIn: "m" }
};

describe("API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("auth login success", async () => {
    vi.mocked(validateAdmin).mockResolvedValue({ id: "admin-1", email: "admin@dtw2026.rw" });

    const res = await request(app).post("/api/auth/login").send({ email: "admin@dtw2026.rw", password: "pass" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTypeOf("string");
    expect(res.body.admin.email).toBe("admin@dtw2026.rw");
  });

  it("public read site content", async () => {
    vi.mocked(getSiteContent).mockResolvedValue({ content: sampleContent, version: 1 });
    const res = await request(app).get("/api/site-content");
    expect(res.status).toBe(200);
    expect(res.body.version).toBe(1);
  });

  it("protected full write rejects missing token", async () => {
    const res = await request(app).put("/api/site-content").send({ content: sampleContent, version: 1 });
    expect(res.status).toBe(401);
  });

  it("validation rejects malformed full payload", async () => {
    const token = signToken({ sub: "admin-1", email: "admin@dtw2026.rw" });
    const res = await request(app)
      .put("/api/site-content")
      .set("Authorization", `Bearer ${token}`)
      .send({ content: { bad: true }, version: 1 });

    expect(res.status).toBe(400);
  });

  it("section write validates only one section", async () => {
    const token = signToken({ sub: "admin-1", email: "admin@dtw2026.rw" });
    vi.mocked(updateSiteSection).mockResolvedValue({ conflict: false, content: sampleContent, version: 2 });

    const res = await request(app)
      .put("/api/site-content/footer")
      .set("Authorization", `Bearer ${token}`)
      .send({
        version: 1,
        value: { tagline: "t", socials: [{ label: "x", href: "#" }], columns: [{ title: "New", links: [{ label: "Link", href: "#" }] }], copyright: "c", madeIn: "m" }
      });

    expect(res.status).toBe(200);
    expect(res.body.version).toBe(2);
  });

  it("section write returns 409 for stale version", async () => {
    const token = signToken({ sub: "admin-1", email: "admin@dtw2026.rw" });
    vi.mocked(updateSiteSection).mockResolvedValue({ conflict: true, currentVersion: 4 });

    const res = await request(app)
      .put("/api/site-content/footer")
      .set("Authorization", `Bearer ${token}`)
      .send({
        version: 1,
        value: { tagline: "t", socials: [{ label: "x", href: "#" }], columns: [{ title: "New", links: [{ label: "Link", href: "#" }] }], copyright: "c", madeIn: "m" }
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("VERSION_CONFLICT");
  });

  it("package inquiry returns created inquiry with updated content", async () => {
    vi.mocked(createPackageInquiry).mockResolvedValue({
      inquiry: { id: "inq-1", createdAt: "2026-05-13T10:00:00.000Z" },
      content: sampleContent,
      version: 2,
    });

    const res = await request(app).post("/api/package-inquiries").send({
      organizationName: "Org",
      contactPerson: "Jane Doe",
      email: "jane@example.com",
      phone: "+250700000000",
      message: "Interested in details",
      packageId: "1",
      packageBadge: "b",
      packagePrice: "1",
      packageCurrency: "RWF",
    });

    expect(res.status).toBe(201);
    expect(res.body.id).toBe("inq-1");
    expect(res.body.version).toBe(2);
    expect(res.body.content.packages[0].slots).toBe(1);
  });
});
