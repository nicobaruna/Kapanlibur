export type LeaveType = 'paid' | 'unpaid';
export type UserGoal = 'hemat' | 'balance' | 'healing' | 'luxury';

export interface FinancialInput {
  monthly_salary: number;
  leave_days_taken: number;
  leave_type: LeaveType;
  trip_days: number;
  total_trip_cost: number;
  user_goal: UserGoal;
}

export interface FinancialSimulation extends FinancialInput {
  daily_salary: number;
  salary_loss: number;
  total_financial_impact: number;
  cost_vs_salary_percentage: number;
}

export interface FinancialAnalysisResult {
  status: 'aman' | 'perlu_pertimbangan' | 'berat';
  insight: {
    summary: string;
    key_reason: string;
  };
  recommendation: {
    decision: string;
    advice: string;
  };
  optimization: string[];
  comparison: {
    salary_vs_cost: string;
    main_cost_driver: string;
  };
  share_text: string;
}

export function buildSimulation(input: FinancialInput): FinancialSimulation {
  const daily_salary = Math.round(input.monthly_salary / 22);
  const salary_loss =
    input.leave_type === 'unpaid'
      ? daily_salary * input.leave_days_taken
      : 0;
  const total_financial_impact = salary_loss + input.total_trip_cost;
  const cost_vs_salary_percentage = Math.round(
    (total_financial_impact / input.monthly_salary) * 100,
  );

  return {
    ...input,
    daily_salary,
    salary_loss,
    total_financial_impact,
    cost_vs_salary_percentage,
  };
}

function formatRp(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export function analyzeFinancial(input: FinancialInput): FinancialAnalysisResult {
  const sim = buildSimulation(input);
  const pct = sim.cost_vs_salary_percentage;
  const goal = input.user_goal;

  // --- Status ---
  let status: FinancialAnalysisResult['status'];
  if (pct < 30) {
    status = 'aman';
  } else if (pct <= 60) {
    status = 'perlu_pertimbangan';
  } else {
    status = 'berat';
  }

  // --- Insight ---
  const totalStr = formatRp(sim.total_financial_impact);
  const pctStr = `${pct}%`;

  let insightSummary: string;
  let insightReason: string;

  if (status === 'aman') {
    insightSummary = `Total dampak finansial sebesar ${totalStr} atau ${pctStr} dari gaji bulanan, masih dalam batas sehat.`;
    insightReason =
      sim.salary_loss > 0
        ? `Kehilangan gaji ${formatRp(sim.salary_loss)} akibat cuti tidak dibayar masih terkompensasi dengan baik.`
        : `Tidak ada kehilangan gaji sehingga beban finansial sepenuhnya berasal dari biaya perjalanan.`;
  } else if (status === 'perlu_pertimbangan') {
    insightSummary = `Pengeluaran ${totalStr} setara ${pctStr} dari gaji — cukup besar dan perlu pertimbangan matang.`;
    insightReason =
      sim.salary_loss > 0
        ? `Kombinasi biaya perjalanan dan kehilangan gaji ${formatRp(sim.salary_loss)} membuat tekanan finansial cukup signifikan.`
        : `Biaya perjalanan mendominasi pengeluaran dan menekan anggaran bulanan secara nyata.`;
  } else {
    insightSummary = `Total ${totalStr} atau ${pctStr} dari gaji — beban ini tergolong berat untuk keuangan bulanan.`;
    insightReason =
      sim.salary_loss > 0
        ? `Kehilangan gaji ${formatRp(sim.salary_loss)} ditambah biaya perjalanan membuat kondisi keuangan sangat tertekan.`
        : `Biaya perjalanan jauh melampaui batas aman dan berpotensi mengganggu kebutuhan bulanan lainnya.`;
  }

  // --- Recommendation ---
  const goalLabel: Record<UserGoal, string> = {
    hemat: 'profil hemat',
    balance: 'profil seimbang',
    healing: 'kebutuhan healing',
    luxury: 'gaya hidup premium',
  };

  let decision: string;
  let advice: string;

  if (status === 'aman') {
    decision = `Liburan ini layak dijalankan sesuai rencana, cocok untuk ${goalLabel[goal]}.`;
    advice =
      goal === 'hemat'
        ? 'Manfaatkan momen ini namun tetap sisihkan sisa gaji untuk tabungan darurat.'
        : goal === 'luxury'
        ? 'Keuangan mendukung, nikmati perjalanan tanpa perlu terlalu membatasi diri.'
        : 'Pastikan anggaran harian sudah ditetapkan agar pengeluaran tidak membengkak.';
  } else if (status === 'perlu_pertimbangan') {
    decision =
      goal === 'hemat'
        ? 'Pertimbangkan ulang rencana ini; ada risiko nyata terhadap tabungan bulanan.'
        : `Liburan bisa dilanjutkan dengan penyesuaian anggaran sesuai ${goalLabel[goal]}.`;
    advice =
      goal === 'hemat'
        ? 'Kurangi durasi perjalanan atau pilih destinasi yang lebih terjangkau.'
        : goal === 'luxury'
        ? 'Bila keuangan memungkinkan, tetap jalankan namun siapkan dana darurat terpisah.'
        : 'Coba pangkas 20-30% biaya perjalanan untuk menjaga stabilitas keuangan.';
  } else {
    decision =
      goal === 'luxury'
        ? 'Biaya sangat tinggi; pastikan ada tabungan cukup sebelum melanjutkan rencana.'
        : 'Sebaiknya tunda atau kurangi skala perjalanan untuk menjaga kesehatan finansial.';
    advice =
      goal === 'hemat'
        ? 'Pertimbangkan alternatif liburan lokal yang jauh lebih hemat.'
        : goal === 'luxury'
        ? 'Jika tetap ingin pergi, cicil persiapan anggaran 2-3 bulan ke depan.'
        : 'Kurangi hari perjalanan atau pilih akomodasi dengan harga lebih terjangkau.';
  }

  // --- Optimization tips ---
  const tips: string[] = [];

  if (sim.leave_type === 'unpaid' && sim.leave_days_taken > 0) {
    tips.push(
      `Manfaatkan cuti yang sudah dibayar (paid leave) agar tidak ada kehilangan gaji ${formatRp(sim.daily_salary)}/hari.`,
    );
  }

  const costPerDay = Math.round(sim.total_trip_cost / Math.max(sim.trip_days, 1));
  if (costPerDay > sim.daily_salary * 1.5) {
    tips.push(
      `Biaya per hari ${formatRp(costPerDay)} cukup tinggi; cari paket promo atau pesan jauh-jauh hari untuk penghematan.`,
    );
  } else {
    tips.push(
      `Bandingkan harga akomodasi dan transportasi di beberapa platform untuk mendapat harga terbaik.`,
    );
  }

  if (pct > 40) {
    tips.push(
      `Kurangi durasi perjalanan 1-2 hari untuk memangkas biaya secara signifikan.`,
    );
  } else {
    tips.push(
      `Siapkan anggaran harian yang ketat agar total pengeluaran tidak melampaui estimasi.`,
    );
  }

  const optimization = tips.slice(0, 2);

  // --- Comparison ---
  const salaryVsCost = `Gaji bulanan ${formatRp(sim.monthly_salary)} vs total dampak ${formatRp(sim.total_financial_impact)}, selisih ${formatRp(sim.monthly_salary - sim.total_financial_impact)}.`;
  const mainCostDriver =
    sim.salary_loss > sim.total_trip_cost
      ? `Kehilangan gaji (${formatRp(sim.salary_loss)}) menjadi beban terbesar dibanding biaya perjalanan.`
      : `Biaya perjalanan (${formatRp(sim.total_trip_cost)}) adalah komponen pengeluaran terbesar.`;

  // --- Share text ---
  const shareTexts: Record<FinancialAnalysisResult['status'], Record<UserGoal, string>> = {
    aman: {
      hemat: `Liburan ${sim.trip_days} hari cuma ${pctStr} gaji, worth it!`,
      balance: `Liburan ${sim.trip_days} hari aman di kantong, gas!`,
      healing: `Healing ${sim.trip_days} hari, finansial tetap sehat!`,
      luxury: `Liburan ${sim.trip_days} hari, keuangan aman terkendali.`,
    },
    perlu_pertimbangan: {
      hemat: `Liburan ${sim.trip_days} hari perlu dipikirkan ulang nih.`,
      balance: `Butuh pertimbangan matang sebelum liburan ${sim.trip_days} hari.`,
      healing: `Healing tetap perlu, tapi atur anggaran dulu ya!`,
      luxury: `Liburan premium, pastikan dompet siap ya!`,
    },
    berat: {
      hemat: `Liburan ${sim.trip_days} hari terlalu berat untuk sekarang.`,
      balance: `Tunda dulu, finansial belum siap untuk liburan ini.`,
      healing: `Healing penting, tapi keuangan perlu dipersiapkan dulu.`,
      luxury: `Impian liburan ini butuh persiapan finansial lebih matang.`,
    },
  };

  const share_text = shareTexts[status][goal];

  return {
    status,
    insight: {summary: insightSummary, key_reason: insightReason},
    recommendation: {decision, advice},
    optimization,
    comparison: {salary_vs_cost: salaryVsCost, main_cost_driver: mainCostDriver},
    share_text,
  };
}
