import { apiRequest, DATA_MODE } from './apiClient';
import { MockStore } from './mockStorage';
import { Provider, ServiceItem, AvailabilitySlot } from '../types';

export const officerService = {
  async getOfficerProvider(officerId: number): Promise<Provider | null> {
    if (DATA_MODE === 'live') {
      try {
        const prov = await apiRequest<any>('/officer/provider');
        if (prov) {
          return {
            provider_id: prov.providerId,
            officer_id: prov.officerId,
            category_id: prov.categoryId,
            provider_name: prov.providerName,
            description: prov.description,
            phone: prov.phone,
            address: prov.address,
            city: prov.city,
            latitude: prov.latitude,
            longitude: prov.longitude,
            verification_status: prov.verificationStatus,
            image_url: prov.imageUrl,
            gallery: [],
            opening_hours: prov.openingHours,
            rating_avg: prov.ratingAvg || 0.0,
            review_count: prov.reviewCount || 0,
            price_range: prov.priceRange || '$$',
            isOpenNow: true,
          };
        }
      } catch (err) {
        console.warn('Backend officer provider fetch failed:', err);
      }
    }
    const providers = MockStore.getProviders();
    return providers.find((prov) => prov.officer_id === officerId) || providers[0] || null;
  },

  async updateProviderProfile(providerId: number, updates: Partial<Provider>): Promise<Provider> {
    if (DATA_MODE === 'live') {
      const updated = await apiRequest<any>(`/officer/provider/${providerId}`, {
        method: 'PUT',
        body: JSON.stringify({
          providerName: updates.provider_name,
          phone: updates.phone,
          address: updates.address,
          openingHours: updates.opening_hours,
          description: updates.description,
          priceRange: updates.price_range,
        }),
      });
      return {
        ...updates,
        provider_id: providerId,
        provider_name: updated.providerName || updates.provider_name || '',
      } as Provider;
    }

    const updated = MockStore.updateProvider(providerId, updates);
    if (!updated) throw new Error('Provider not found');
    return updated;
  },

  async addService(service: {
    provider_id: number;
    service_name: string;
    description: string;
    price: number;
    duration_mins?: number;
  }): Promise<ServiceItem> {
    if (DATA_MODE === 'live') {
      const added = await apiRequest<any>(`/officer/provider/${service.provider_id}/services`, {
        method: 'POST',
        body: JSON.stringify({
          serviceName: service.service_name,
          description: service.description,
          price: service.price,
          durationMins: service.duration_mins,
        }),
      });
      return {
        service_id: added.serviceId,
        provider_id: added.providerId,
        service_name: added.serviceName,
        description: added.description,
        price: added.price,
        duration_mins: added.durationMins,
      };
    }

    const newService: ServiceItem = {
      service_id: Date.now(),
      ...service,
    };
    return MockStore.addService(newService);
  },

  async updateService(serviceId: number, updates: Partial<ServiceItem>): Promise<ServiceItem> {
    if (DATA_MODE === 'live') {
      const updated = await apiRequest<any>(`/officer/services/${serviceId}`, {
        method: 'PUT',
        body: JSON.stringify({
          serviceName: updates.service_name,
          description: updates.description,
          price: updates.price,
          durationMins: updates.duration_mins,
        }),
      });
      return {
        service_id: updated.serviceId,
        provider_id: updated.providerId,
        service_name: updated.serviceName,
        description: updated.description,
        price: updated.price,
        duration_mins: updated.durationMins,
      };
    }

    const updated = MockStore.updateService(serviceId, updates);
    if (!updated) throw new Error('Service not found');
    return updated;
  },

  async deleteService(serviceId: number): Promise<boolean> {
    if (DATA_MODE === 'live') {
      try {
        await apiRequest<void>(`/officer/services/${serviceId}`, {
          method: 'DELETE',
        });
        return true;
      } catch (err) {
        console.warn('Backend service delete failed:', err);
      }
    }
    return MockStore.deleteService(serviceId);
  },

  async addAvailabilitySlot(slot: {
    provider_id: number;
    available_date: string;
    start_time: string;
    end_time: string;
    status: AvailabilitySlot['status'];
  }): Promise<AvailabilitySlot> {
    if (DATA_MODE === 'live') {
      const added = await apiRequest<any>(`/officer/provider/${slot.provider_id}/slots`, {
        method: 'POST',
        body: JSON.stringify({
          availableDate: slot.available_date,
          startTime: slot.start_time,
          endTime: slot.end_time,
          status: slot.status,
          capacity: 1,
        }),
      });
      return {
        availability_id: added.availabilityId,
        provider_id: added.providerId,
        available_date: added.availableDate,
        start_time: added.startTime,
        end_time: added.endTime,
        status: added.status,
      };
    }

    const newSlot: AvailabilitySlot = {
      availability_id: Date.now(),
      ...slot,
    };
    return MockStore.addSlot(newSlot);
  },

  async deleteAvailabilitySlot(slotId: number): Promise<boolean> {
    if (DATA_MODE === 'live') {
      try {
        await apiRequest<void>(`/officer/slots/${slotId}`, {
          method: 'DELETE',
        });
        return true;
      } catch (err) {
        console.warn('Backend slot delete failed:', err);
      }
    }
    return MockStore.deleteSlot(slotId);
  },
};
