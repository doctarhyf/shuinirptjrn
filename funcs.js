const a = 10;

// Create a document
const PDFDocument = require("pdfkit");
const fs = require("fs");
const doc = new PDFDocument();

// Pipe its output somewhere, like to a file or HTTP response
// See below for browser usage
doc.pipe(fs.createWriteStream("output.pdf"));

// Embed a font, set the font size, and render some text
doc
  /* .font("fonts/Bold/Bold.ttf") */
  .fontSize(12);
//.text("Some text with an embedded font!", 0, 0);

const ph = 790;
const pw = 610;
const counth = 10;
const countw = 10;
const steph = ph / counth;
const stepw = pw / countw;
const lh = 10;
const lw = 10;
const ml = 40;
const mt = 80;
const mb = 80;
const mr = 40;
const rowh = 40;
const colw = 60;
const logow = 140;
const gap = 10;

function drawLables() {
  doc.fontSize(12).text("TEMPS", ml + gap, mt + gap);
  doc.text("CHEF DE POSTE", ml * 2.6, mt + gap, { width: gap * 6 });
  doc.text("MACHINE", ml * 4.05, mt + gap, { width: gap * 6 });
  doc.text("NOM DES AGENTS", ml * 5.7, mt + gap, { width: gap * 20 });
  doc
    .fontSize(10.5)
    .text("NBR\nCAMIONS", ml * 9.4, mt + gap, { width: gap * 5 });
  doc.fontSize(10).text("DIFFERENCE DE\nCHARGEMENT", ml * 10.9, mt + gap - 5, {
    width: gap * 8,
  });

  doc.fontSize(10).text("MONT.(T)", ml * 13.1, mt + gap - 5, {
    width: gap * 8,
  });

  doc.fontSize(12).text("07h00\n15h00", ml + gap, gap * 13, {
    width: gap * 8,
  });

  doc.fontSize(10).text("POSTE DU\nMATIN", ml + gap - 5, gap * 25, {
    width: gap * 8,
  });

  doc.fontSize(12).text("15h00\n23h00", ml + gap, gap * 29, {
    width: gap * 8,
  });

  doc.fontSize(12).text("POSTE\nAPREM", ml + gap, gap * 49, {
    width: gap * 8,
  });
  doc.fontSize(12).text("23h00\n07h00", ml + gap, gap * 53, {
    width: gap * 8,
  });

  doc.fontSize(12).text("23h00\n07h00", ml + gap, gap * 68, {
    width: gap * 8,
  });
}

function drawTitle() {
  doc
    .fontSize(14)
    .text("RAPPORT DU CHARGEMENT JOURNALIER", ml + 10 + logow, mt - mt / 2.5);
}
function drawLogo() {
  doc.image("img/logo.png", ml, 15, { width: logow });
}

function dl(sx, sy, ex, ey, strokeColor = "black") {
  doc.strokeColor(strokeColor);
  doc.moveTo(sx, sy).lineTo(ex, ey).stroke();
}

function drawVLines() {
  dl(ml, mt, ml, ph - mb / 2.7);
  dl(pw - mr, mt, pw - mr, ph - mb / 2.7);

  dl(ml + colw, mt, ml + colw, ph - mb / 2.7);
  dl(ml + colw * 2, mt, ml + colw * 2, ph - mb / 2.7);

  dl(ml + colw * 3, mt, ml + colw * 3, ph - mb / 2.7);

  dl(ml + colw * 5.5, mt, ml + colw * 5.5, ph - mb / 2.7);
  dl(ml + colw * 6.5, mt, ml + colw * 6.5, ph - mb / 2.7);
  dl(ml + colw * 8, mt, ml + colw * 8, ph - mb / 2.7);
}

function drawHLines() {
  dl(ml, mt, pw - mr, mt);
  dl(ml, mt + rowh, pw - mr, mt + rowh);

  dl(ml, mt * 3, pw - mr, mt * 3);

  dl(ml, mt * 3, pw - mr, mt * 3);
  dl(ml, mt * 3 + rowh, pw - mr, mt * 3 + rowh);

  dl(ml, mt * 3 * 2, pw - mr, mt * 3 * 2);
  dl(ml, mt * 3 * 2 + rowh, pw - mr, mt * 3 * 2 + rowh);

  dl(ml, mt * 3 * 2.6 + rowh, pw - mr, mt * 3 * 2.6 + rowh);
  dl(ml, ph - mb, pw - mr, ph - mb);

  dl(ml, mt * 3 * 3 + rowh, pw - mr, mt * 3 * 3 + rowh);
}

function drawText(d, x, y) {
  doc.text(d, x, y);
}

function drawNbrCamions(data) {
  const shifts = {
    m: { xsacs: gap * 38, ysacs: gap * 13, xt: gap * 38, yt: gap * 15 },
    p: { xsacs: gap * 38, ysacs: gap * 13, xt: gap * 38, yt: gap * 15 },
    n: { xsacs: gap * 38, ysacs: gap * 13, xt: gap * 38, yt: gap * 15 },
  };

  drawText(data[0] + " S", shifts.m.xsacs, shifts.m.ysacs);
  drawText(data[0] / 20 + " T", shifts.m.xt, shifts.m.yt);

  drawText(data[1] + " S", shifts.m.xsacs, shifts.m.ysacs + gap * 16);
  drawText(data[1] / 20 + " T", shifts.m.xt, shifts.m.yt + gap * 16);

  drawText(data[2] + " S", shifts.m.xsacs, shifts.m.ysacs + gap * 40);
  drawText(data[2] / 20 + " T", shifts.m.xt, shifts.m.yt + gap * 40);
}

function calcBonus(t) {
  return t / 20 + " - 600 =\n\n   " + (t / 20 - 600) + " T";
}

const shifts = {
  m: { xsacs: gap * 44, ysacs: gap * 13, xt: gap * 38, yt: gap * 15 },
  p: { xsacs: gap * 44, ysacs: gap * 13, xt: gap * 38, yt: gap * 15 },
  n: { xsacs: gap * 44, ysacs: gap * 13, xt: gap * 38, yt: gap * 15 },
};

function drawDiffChargement(data) {
  drawText(calcBonus(data[0]), shifts.m.xsacs, shifts.m.ysacs);

  drawText(calcBonus(data[1]), shifts.m.xsacs, shifts.m.ysacs + gap * 16);

  drawText(calcBonus(data[2]), shifts.m.xsacs, shifts.m.ysacs + gap * 40);
}

function calcMt(t) {
  return t / 20 - 600;
}

function drawMont(data) {
  const mtm = calcMt(data[0]);
  const mtp = calcMt(data[1]);
  const mtn = calcMt(data[2]);
  const tot = mtm + mtp + mtn;

  drawText(mtm + " T", shifts.m.xsacs + gap * 10, shifts.m.ysacs);
  drawText(
    mtm * 1000 + " FC",
    shifts.m.xsacs + gap * 10,
    shifts.m.ysacs + gap * 12
  );

  drawText(mtp + " T", shifts.m.xsacs + gap * 10, shifts.m.ysacs + gap * 16);
  drawText(
    mtp * 1000 + " FC",
    shifts.m.xsacs + gap * 10,
    shifts.m.ysacs + gap * 36
  );

  drawText(mtn + " T", shifts.m.xsacs + gap * 10, shifts.m.ysacs + gap * 40);
  drawText(
    mtn * 1000 + " FC",
    shifts.m.xsacs + gap * 10,
    shifts.m.ysacs + gap * 55
  );

  drawText(
    tot * 1000 + " FC",
    shifts.m.xsacs + gap * 10,
    shifts.m.ysacs + gap * 60
  );
}

function drawTable(data) {
  drawNbrCamions(data);
  drawDiffChargement(data);
  drawMont(data);

  drawLogo();
  drawTitle();
  drawVLines();
  drawHLines();
  drawLables();
  doc.end();
}

module.exports = { drawTable };
