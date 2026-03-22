import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {
  analyzeFinancial,
  buildSimulation,
  type FinancialInput,
  type FinancialAnalysisResult,
  type LeaveType,
  type UserGoal,
} from '../services/FinancialAnalysisService';

const COLORS = {
  red: '#C8102E',
  white: '#FFFFFF',
  bg: '#F7F3EF',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSub: '#6B7280',
  green: '#27AE60',
  greenLight: '#D5F5E3',
  orange: '#E67E22',
  orangeLight: '#FEF3E2',
  redLight: '#FDECEA',
  yellowLight: '#FFFBEB',
  yellow: '#D97706',
  border: '#E8E0D8',
  inputBg: '#F9F7F5',
  purple: '#8B5CF6',
  purpleLight: '#EDE9FE',
};

const STATUS_CONFIG = {
  aman: {color: COLORS.green, bg: COLORS.greenLight, label: 'Aman'},
  perlu_pertimbangan: {
    color: COLORS.yellow,
    bg: COLORS.yellowLight,
    label: 'Perlu Pertimbangan',
  },
  berat: {color: COLORS.red, bg: COLORS.redLight, label: 'Berat'},
};

const GOAL_OPTIONS: {value: UserGoal; label: string; desc: string}[] = [
  {value: 'hemat', label: 'Hemat', desc: 'Prioritas menabung'},
  {value: 'balance', label: 'Balance', desc: 'Seimbang'},
  {value: 'healing', label: 'Healing', desc: 'Butuh refreshing'},
  {value: 'luxury', label: 'Luxury', desc: 'No limit'},
];

function formatRupiah(value: number): string {
  return 'Rp ' + value.toLocaleString('id-ID');
}

function CurrencyInput({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Text style={styles.inputPrefix}>Rp</Text>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={v => onChangeText(v.replace(/[^0-9]/g, ''))}
          placeholder={placeholder ?? '0'}
          placeholderTextColor={COLORS.textSub}
          keyboardType="numeric"
        />
      </View>
    </View>
  );
}

function NumberInput({
  label,
  value,
  onChangeText,
  suffix,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  suffix?: string;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.textInput, {flex: 1}]}
          value={value}
          onChangeText={v => onChangeText(v.replace(/[^0-9]/g, ''))}
          placeholder="0"
          placeholderTextColor={COLORS.textSub}
          keyboardType="numeric"
        />
        {suffix && <Text style={styles.inputSuffix}>{suffix}</Text>}
      </View>
    </View>
  );
}

function ApiKeyInput({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (v: string) => void;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Claude API Key</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.textInput, {flex: 1, fontSize: 12}]}
          value={value}
          onChangeText={onChangeText}
          placeholder="sk-ant-..."
          placeholderTextColor={COLORS.textSub}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <Text style={styles.inputHint}>
        Dapatkan API key di console.anthropic.com
      </Text>
    </View>
  );
}

function ResultCard({result, simulation}: {
  result: FinancialAnalysisResult;
  simulation: ReturnType<typeof buildSimulation>;
}) {
  const statusConf = STATUS_CONFIG[result.status];

  return (
    <View style={styles.resultContainer}>
      {/* Status badge */}
      <View style={[styles.statusBadge, {backgroundColor: statusConf.bg}]}>
        <View style={[styles.statusDot, {backgroundColor: statusConf.color}]} />
        <Text style={[styles.statusText, {color: statusConf.color}]}>
          {statusConf.label}
        </Text>
      </View>

      {/* Simulation summary */}
      <View style={styles.simSummary}>
        <View style={styles.simRow}>
          <Text style={styles.simLabel}>Total Dampak Finansial</Text>
          <Text style={[styles.simValue, {color: COLORS.red, fontWeight: '800'}]}>
            {formatRupiah(simulation.total_financial_impact)}
          </Text>
        </View>
        <View style={styles.simRow}>
          <Text style={styles.simLabel}>Persentase dari Gaji</Text>
          <Text style={[styles.simValue, {color: statusConf.color, fontWeight: '700'}]}>
            {simulation.cost_vs_salary_percentage}%
          </Text>
        </View>
        {simulation.salary_loss > 0 && (
          <View style={styles.simRow}>
            <Text style={styles.simLabel}>Kehilangan Gaji (cuti tidak dibayar)</Text>
            <Text style={styles.simValue}>
              {formatRupiah(simulation.salary_loss)}
            </Text>
          </View>
        )}
        <View style={styles.simRow}>
          <Text style={styles.simLabel}>Biaya Perjalanan</Text>
          <Text style={styles.simValue}>
            {formatRupiah(simulation.total_trip_cost)}
          </Text>
        </View>
      </View>

      {/* Insight */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insight</Text>
        <Text style={styles.sectionText}>{result.insight.summary}</Text>
        <Text style={[styles.sectionText, styles.sectionTextSub]}>
          {result.insight.key_reason}
        </Text>
      </View>

      {/* Recommendation */}
      <View style={[styles.section, {backgroundColor: `${statusConf.color}10`, borderColor: `${statusConf.color}30`}]}>
        <Text style={[styles.sectionTitle, {color: statusConf.color}]}>
          Rekomendasi
        </Text>
        <Text style={styles.sectionText}>{result.recommendation.decision}</Text>
        <Text style={[styles.sectionText, styles.sectionTextSub]}>
          {result.recommendation.advice}
        </Text>
      </View>

      {/* Optimization tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tips Optimasi</Text>
        {result.optimization.map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <View style={[styles.tipBullet, {backgroundColor: statusConf.color}]} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      {/* Comparison */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Perbandingan</Text>
        <Text style={styles.sectionText}>{result.comparison.salary_vs_cost}</Text>
        <Text style={[styles.sectionText, styles.sectionTextSub]}>
          {result.comparison.main_cost_driver}
        </Text>
      </View>

      {/* Share text */}
      <View style={[styles.section, {backgroundColor: COLORS.purpleLight, borderColor: COLORS.purple + '40'}]}>
        <Text style={[styles.sectionTitle, {color: COLORS.purple}]}>
          Teks untuk Dibagikan
        </Text>
        <Text style={[styles.shareText]}>"{result.share_text}"</Text>
      </View>
    </View>
  );
}

export default function FinancialPlannerScreen() {
  const [apiKey, setApiKey] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [tripDays, setTripDays] = useState('');
  const [leaveDays, setLeaveDays] = useState('');
  const [leaveType, setLeaveType] = useState<LeaveType>('paid');
  const [tripCost, setTripCost] = useState('');
  const [userGoal, setUserGoal] = useState<UserGoal>('balance');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FinancialAnalysisResult | null>(null);
  const [simulation, setSimulation] = useState<ReturnType<typeof buildSimulation> | null>(null);

  const handleAnalyze = async () => {
    if (!apiKey.trim()) {
      Alert.alert('API Key diperlukan', 'Masukkan Claude API key untuk melanjutkan.');
      return;
    }
    if (!monthlySalary || !tripCost) {
      Alert.alert('Data tidak lengkap', 'Isi minimal gaji bulanan dan biaya perjalanan.');
      return;
    }

    const input: FinancialInput = {
      monthly_salary: parseInt(monthlySalary, 10),
      leave_days_taken: parseInt(leaveDays || '0', 10),
      leave_type: leaveType,
      trip_days: parseInt(tripDays || '1', 10),
      total_trip_cost: parseInt(tripCost, 10),
      user_goal: userGoal,
    };

    const sim = buildSimulation(input);
    setSimulation(sim);
    setLoading(true);
    setResult(null);

    try {
      const analysisResult = await analyzeFinancial(apiKey, input);
      setResult(analysisResult);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      Alert.alert('Gagal', `Analisis gagal: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perencana Finansial</Text>
        <Text style={styles.headerSub}>
          Analisis dampak finansial liburan kamu dengan AI
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* API Key Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Konfigurasi API</Text>
          <ApiKeyInput value={apiKey} onChangeText={setApiKey} />
        </View>

        {/* Income Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Gaji</Text>
          <CurrencyInput
            label="Gaji Bulanan"
            value={monthlySalary}
            onChangeText={setMonthlySalary}
            placeholder="5000000"
          />
        </View>

        {/* Trip Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Perjalanan</Text>
          <NumberInput
            label="Lama Perjalanan"
            value={tripDays}
            onChangeText={setTripDays}
            suffix="hari"
          />
          <CurrencyInput
            label="Total Biaya Perjalanan"
            value={tripCost}
            onChangeText={setTripCost}
            placeholder="3000000"
          />
        </View>

        {/* Leave Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Cuti</Text>
          <NumberInput
            label="Jumlah Hari Cuti"
            value={leaveDays}
            onChangeText={setLeaveDays}
            suffix="hari"
          />

          {/* Leave Type Toggle */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Jenis Cuti</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  leaveType === 'paid' && styles.toggleBtnActive,
                ]}
                onPress={() => setLeaveType('paid')}>
                <Text
                  style={[
                    styles.toggleBtnText,
                    leaveType === 'paid' && styles.toggleBtnTextActive,
                  ]}>
                  Dibayar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  leaveType === 'unpaid' && styles.toggleBtnActive,
                ]}
                onPress={() => setLeaveType('unpaid')}>
                <Text
                  style={[
                    styles.toggleBtnText,
                    leaveType === 'unpaid' && styles.toggleBtnTextActive,
                  ]}>
                  Tidak Dibayar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Goal Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tujuan Finansial</Text>
          <View style={styles.goalGrid}>
            {GOAL_OPTIONS.map(g => (
              <TouchableOpacity
                key={g.value}
                style={[
                  styles.goalBtn,
                  userGoal === g.value && styles.goalBtnActive,
                ]}
                onPress={() => setUserGoal(g.value)}>
                <Text
                  style={[
                    styles.goalBtnLabel,
                    userGoal === g.value && styles.goalBtnLabelActive,
                  ]}>
                  {g.label}
                </Text>
                <Text
                  style={[
                    styles.goalBtnDesc,
                    userGoal === g.value && styles.goalBtnDescActive,
                  ]}>
                  {g.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Analyze Button */}
        <TouchableOpacity
          style={[styles.analyzeBtn, loading && styles.analyzeBtnDisabled]}
          onPress={handleAnalyze}
          disabled={loading}
          activeOpacity={0.8}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Text style={styles.analyzeBtnText}>Analisis Sekarang</Text>
          )}
        </TouchableOpacity>

        {loading && (
          <Text style={styles.loadingText}>
            Claude sedang menganalisis data finansial kamu...
          </Text>
        )}

        {/* Result */}
        {result && simulation && (
          <ResultCard result={result} simulation={simulation} />
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    backgroundColor: COLORS.red,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 + 12 : 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
    elevation: 4,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '800',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 46,
  },
  inputPrefix: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSub,
    marginRight: 8,
  },
  inputSuffix: {
    fontSize: 13,
    color: COLORS.textSub,
    fontWeight: '600',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    padding: 0,
  },
  inputHint: {
    fontSize: 11,
    color: COLORS.textSub,
    marginTop: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSub,
  },
  toggleBtnTextActive: {
    color: COLORS.white,
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalBtn: {
    width: '47%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  goalBtnActive: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },
  goalBtnLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  goalBtnLabelActive: {
    color: COLORS.white,
  },
  goalBtnDesc: {
    fontSize: 11,
    color: COLORS.textSub,
    marginTop: 2,
  },
  goalBtnDescActive: {
    color: 'rgba(255,255,255,0.7)',
  },
  analyzeBtn: {
    backgroundColor: COLORS.red,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: COLORS.red,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  analyzeBtnDisabled: {
    opacity: 0.7,
  },
  analyzeBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  loadingText: {
    textAlign: 'center',
    color: COLORS.textSub,
    fontSize: 13,
    marginBottom: 16,
  },
  // Result styles
  resultContainer: {
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '800',
  },
  simSummary: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  simRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  simLabel: {
    fontSize: 12,
    color: COLORS.textSub,
    flex: 1,
    fontWeight: '500',
  },
  simValue: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '700',
    textAlign: 'right',
  },
  section: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  sectionTextSub: {
    color: COLORS.textSub,
    fontSize: 13,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
  shareText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.purple,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  bottomSpace: {
    height: 30,
  },
});
