import { Text } from '@/components/ui/text';
import { cn } from '@/lib/cn';
import { useDashboardData } from '@/lib/hooks/useDashboardData';
import type { MemberWithWorkingStats } from '@/lib/types/dashboard';
import { Button, Spinner } from 'heroui-native';
import React, { ComponentProps } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { MemberListItem } from './member-list-item';
import { SafeAreaView } from 'react-native-safe-area-context';

type DashboardScreenProps = {} & ComponentProps<typeof View>;

export const DashboardScreen = ({ className, ...props }: DashboardScreenProps) => {
  const { members, isLoading, isError, error, refetch, isRefetching } = useDashboardData();

  if (isLoading && !isRefetching) {
    return (
      <View
        className={cn('bg-background flex-1 items-center justify-center gap-3', className)}
        {...props}>
        <Spinner size="lg" color="danger" />
        <Text className="text-muted-foreground text-sm">Laster inn kontorstatus...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        className={cn('bg-background flex-1 items-center justify-center gap-4 p-6', className)}
        {...props}>
        <Text className="text-foreground text-center text-lg font-semibold">
          Klarte ikke å hente dashboard-data
        </Text>
        <Text className="text-muted-foreground text-center text-sm">
          {error instanceof Error ? error.message : 'Ukjent feil oppstod'}
        </Text>
        <Button variant="secondary" onPress={() => refetch()}>
          Prøv igjen
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView className={cn('bg-background flex-1', className)} {...props}>
      <View className="px-5 pb-2 pt-4">
        <Text className="text-foreground text-3xl font-extrabold tracking-tight">Dashbord</Text>
      </View>

      <FlatList
        data={members}
        keyExtractor={(item: MemberWithWorkingStats) => item.github}
        renderItem={({ item }: { item: MemberWithWorkingStats }) => (
          <View className="px-5 py-1">
            <MemberListItem member={item} />
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#dc2626"
            colors={['#dc2626']}
          />
        }
        contentContainerStyle={{
          paddingBottom: 110,
          paddingTop: 4,
        }}
        ListEmptyComponent={
          <View className="items-center justify-center px-6 py-16">
            <Text className="text-muted-foreground text-sm">Ingen medlemmer funnet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};
