import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AppScreen } from '@/components/AppScreen';
import { AppCard } from '@/components/AppCard';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/use-theme';
import { createTextStyle, Radius, Spacing } from '@/constants/theme';
import { MENTOR_OPTIONS } from '@/constants/mentors';
import { apiClient } from '@/services/api/client';
import { apiSeedDemoData } from '@/services/api/journey';

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, loading, logout, updateUser } = useAuth();

  const [editVisible, setEditVisible] = useState(false);
  const [mentorVisible, setMentorVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Edit fields state
  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [semester, setSemester] = useState(user?.semester || '');
  const [submitting, setSubmitting] = useState(false);
  const [seedingDemo, setSeedingDemo] = useState(false);

  const activeMentor = MENTOR_OPTIONS.find((m) => m.id === user?.mentorId);

  if (loading) {
    return <AppScreen state="loading" loadingMessage="Loading profile..." scrollable={false} />;
  }

  async function handleUpdateProfile() {
    setSubmitting(true);
    try {
      const res = await apiClient.patch('/user/profile', { name, college, semester });
      if (res.data.success) {
        updateUser(res.data.data);
        setEditVisible(false);
      }
    } catch {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSwitchMentor(mentorId: string) {
    try {
      const res = await apiClient.post('/mentor/select', { mentorId });
      if (res.data.success) {
        // Update user state with new mentor
        if (user) {
          updateUser({ ...user, mentorId });
        }
        setMentorVisible(false);
        Alert.alert('Success', `Switched mentor to ${mentorId === 'ved' ? 'Ved' : mentorId === 'kai' ? 'Kai' : 'Ira'}.`);
      }
    } catch {
      Alert.alert('Error', 'Failed to change mentor.');
    }
  }

  async function handleSeedDemoData() {
    setSeedingDemo(true);
    try {
      const result = await apiSeedDemoData();
      Alert.alert('Demo Seeded', 'Welcome to Avati! You have been logged in as Alex Rivera with sample timeline data.', [
        {
          text: 'Explore App',
          onPress: () => {
            router.replace('/(tabs)/home');
          },
        },
      ]);
    } catch {
      Alert.alert('Error', 'Seeding failed. Please check network.');
    } finally {
      setSeedingDemo(false);
    }
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: theme.text }]}>Profile</Text>
      </View>

      {/* Profile Details Card */}
      <AppCard style={styles.profileCard}>
        <View style={styles.avatarRow}>
          <View style={[styles.avatarCircle, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.avatarLetter, { color: theme.primary }]}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.mainInfo}>
            <Text style={[styles.userName, { color: theme.text }]}>{user?.name}</Text>
            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
              {user?.isGuest ? 'Guest Learner Account' : user?.email}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.textMuted }]}>College</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>
            {user?.college || 'Not set'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Semester</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>
            {user?.semester || 'Not set'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Active Mentor</Text>
          <Text style={[styles.detailValue, { color: theme.primary, fontWeight: '600' }]}>
            {activeMentor?.name || 'None selected'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setName(user?.name || '');
            setCollege(user?.college || '');
            setSemester(user?.semester || '');
            setEditVisible(true);
          }}
          style={[styles.editBtn, { borderColor: theme.border }]}
        >
          <Text style={[styles.editBtnText, { color: theme.text }]}>Edit Profile</Text>
        </TouchableOpacity>
      </AppCard>

      {/* Mentor Switching */}
      <AppCard style={styles.card}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>AI Mentor</Text>
        <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
          Change your guide personality at any time. Conversation history is kept.
        </Text>
        <TouchableOpacity
          onPress={() => setMentorVisible(true)}
          style={[styles.switchMentorBtn, { backgroundColor: theme.primary }]}
        >
          <Text style={[styles.switchMentorBtnText, { color: theme.white }]}>Switch Mentor</Text>
        </TouchableOpacity>
      </AppCard>

      {/* Seed Demo Data Card for Hackathon Judges */}
      <AppCard style={[styles.card, { borderColor: theme.accent, borderWidth: 1 }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Demo Mode</Text>
        <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
          Seed mock data (focus sessions, journals, milestone history) to evaluate the complete Avati journey instantly.
        </Text>
        <TouchableOpacity
          onPress={handleSeedDemoData}
          disabled={seedingDemo}
          style={[styles.demoBtn, { backgroundColor: theme.accent }]}
        >
          {seedingDemo ? (
            <ActivityIndicator size="small" color={theme.white} />
          ) : (
            <Text style={[styles.demoBtnText, { color: theme.white }]}>Seed Demo Data</Text>
          )}
        </TouchableOpacity>
      </AppCard>

      {/* Settings Options */}
      <TouchableOpacity
        onPress={() => setSettingsVisible(true)}
        style={[styles.settingsRowBtn, { borderBottomColor: theme.borderLight }]}
      >
        <Text style={[styles.settingsRowText, { color: theme.text }]}>Settings & Privacy</Text>
        <Text style={{ color: theme.textMuted }}>➔</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => logout()}
        style={[styles.logoutBtn, { borderColor: theme.error }]}
      >
        <Text style={[styles.logoutBtnText, { color: theme.error }]}>
          {user?.isGuest ? 'Upgrade Account' : 'Log Out'}
        </Text>
      </TouchableOpacity>

      {/* Modals: Edit Profile */}
      <Modal visible={editVisible} animationType="slide">
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Profile</Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text, borderColor: theme.border }]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>College</Text>
            <TextInput
              value={college}
              onChangeText={setCollege}
              placeholder="State University"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text, borderColor: theme.border }]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Semester</Text>
            <TextInput
              value={semester}
              onChangeText={setSemester}
              placeholder="e.g. 3rd Semester"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text, borderColor: theme.border }]}
            />
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity onPress={() => setEditVisible(false)} style={styles.cancelBtn}>
              <Text style={{ color: theme.textSecondary }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleUpdateProfile}
              disabled={submitting}
              style={[styles.saveBtn, { backgroundColor: theme.primary }]}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={theme.white} />
              ) : (
                <Text style={{ color: theme.white, fontWeight: '600' }}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modals: Switch Mentor */}
      <Modal visible={mentorVisible} animationType="slide">
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Choose Your Mentor</Text>
          <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
            Change guide. Past messages remain saved.
          </Text>

          {MENTOR_OPTIONS.map((m) => {
            const isCurrent = m.id === user?.mentorId;
            return (
              <AppCard
                key={m.id}
                onPress={() => handleSwitchMentor(m.id)}
                style={[
                  styles.mentorSelectCard,
                  isCurrent && { borderColor: theme.primary, borderWidth: 2 },
                ]}
              >
                <Text style={[styles.mentorName, { color: theme.text }]}>
                  {m.name} {isCurrent ? '(Active)' : ''}
                </Text>
                <Text style={[styles.mentorDesc, { color: theme.textSecondary }]}>
                  {m.personality}
                </Text>
              </AppCard>
            );
          })}

          <TouchableOpacity onPress={() => setMentorVisible(false)} style={styles.closeBtn}>
            <Text style={{ color: theme.primary, fontWeight: '600' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modals: Settings */}
      <Modal visible={settingsVisible} animationType="slide">
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Settings</Text>

          <View style={styles.settingsGroup}>
            <Text style={[styles.settingsItem, { color: theme.text }]}>Theme: Light Mode Only (MVP)</Text>
            <Text style={[styles.settingsItem, { color: theme.text }]}>Version: 1.0.0 (Hackathon)</Text>
            <TouchableOpacity
              onPress={() => {
                Alert.alert('About Avati', 'Avati is an identity-first learning companion platform designed to build intuition, reflection, and focused growth habits.');
              }}
              style={styles.settingsLink}
            >
              <Text style={{ color: theme.primary }}>About Avati</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Alert.alert('Privacy', 'Avati local history data is stored securely on your device. Analytics and telemetry are disabled.');
              }}
              style={styles.settingsLink}
            >
              <Text style={{ color: theme.primary }}>Privacy Policy & Terms</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => setSettingsVisible(false)} style={styles.closeBtn}>
            <Text style={{ color: theme.primary, fontWeight: '600' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  heading: {
    ...createTextStyle('xxxl', 'bold'),
  },
  profileCard: {
    marginHorizontal: Spacing.xxl,
    marginBottom: Spacing.md,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  avatarLetter: {
    ...createTextStyle('lg', 'bold'),
  },
  mainInfo: {
    flex: 1,
  },
  userName: {
    ...createTextStyle('lg', 'semiBold'),
  },
  userEmail: {
    ...createTextStyle('xs', 'regular'),
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  detailLabel: {
    ...createTextStyle('sm', 'medium'),
  },
  detailValue: {
    ...createTextStyle('sm', 'regular'),
  },
  editBtn: {
    borderWidth: 1,
    borderRadius: Radius.button,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  editBtnText: {
    ...createTextStyle('sm', 'semiBold'),
  },
  card: {
    marginHorizontal: Spacing.xxl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...createTextStyle('md', 'semiBold'),
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    ...createTextStyle('xs', 'regular'),
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  switchMentorBtn: {
    borderRadius: Radius.button,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  switchMentorBtnText: {
    ...createTextStyle('sm', 'semiBold'),
  },
  demoBtn: {
    borderRadius: Radius.button,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  demoBtnText: {
    ...createTextStyle('sm', 'semiBold'),
  },
  settingsRowBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    marginHorizontal: Spacing.xxl,
    borderBottomWidth: 1,
  },
  settingsRowText: {
    ...createTextStyle('md', 'medium'),
  },
  logoutBtn: {
    marginHorizontal: Spacing.xxl,
    marginTop: Spacing.xl,
    marginBottom: Spacing.huge,
    borderWidth: 1.5,
    borderRadius: Radius.button,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  logoutBtnText: {
    ...createTextStyle('md', 'semiBold'),
  },
  modalContent: {
    flex: 1,
    padding: Spacing.xxl,
    justifyContent: 'center',
  },
  modalTitle: {
    ...createTextStyle('xxl', 'bold'),
    marginBottom: Spacing.md,
  },
  modalSubtitle: {
    ...createTextStyle('sm', 'regular'),
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...createTextStyle('sm', 'medium'),
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.input,
    padding: Spacing.md,
    ...createTextStyle('sm', 'regular'),
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  cancelBtn: {
    padding: Spacing.md,
  },
  saveBtn: {
    borderRadius: Radius.button,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  mentorSelectCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  mentorName: {
    ...createTextStyle('md', 'semiBold'),
  },
  mentorDesc: {
    ...createTextStyle('xs', 'regular'),
    marginTop: 4,
  },
  closeBtn: {
    alignSelf: 'center',
    marginTop: Spacing.xl,
    padding: Spacing.md,
  },
  settingsGroup: {
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  settingsItem: {
    ...createTextStyle('md', 'regular'),
  },
  settingsLink: {
    paddingVertical: Spacing.sm,
  },
});
