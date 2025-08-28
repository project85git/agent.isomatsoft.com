import { Switch, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGetRequest, sendPatchRequest } from '../api/api';
import AddMoreSite from '../Modals/AddMoreSite';
import LoadingSpinner from '../component/loading/LoadingSpinner';
import { detailsOfSite } from '../redux/switch-web/action';
import { checkPermission } from '../../utils/utils';
import { Navigate } from 'react-router-dom';

const SiteManage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();

  const {
    color,
    primaryBg,
    iconColor,
    secondaryBg,
    bg,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);

  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState('-1');
  const [siteData, setSiteData] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);

  const getAdminDetails = JSON.parse(localStorage.getItem("adminauth"));
  if (!getAdminDetails || !getAdminDetails?.token) {
    return <Navigate to="/login" replace />;
  }

  const getSiteDetails = async () => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/site-switch/get-all-site-record`;
    try {
      let response = await fetchGetRequest(url);
      setSiteData(response?.data);
      dispatch(detailsOfSite(response?.data));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSiteDetails();
  }, []);

  const handleChange = (index, key, value) => {
    const updatedFormData = [...siteData];
    updatedFormData[index][key] = value;
    setSiteData(updatedFormData);
  };

  const handleUpdate = async (index, id) => {
    const payload = siteData[index];
    console
    setActive(id);
    setUpdateLoading(true);
    try {
      const response = await sendPatchRequest(
        `${import.meta.env.VITE_API_URL}/api/site-switch/update-site-record/${id}`,
        payload
      );
      toast({
        title: 'Updated Successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setUpdateLoading(false);
      getSiteDetails();
    } catch (error) {
      setUpdateLoading(false);
      toast({
        title: error?.response?.data?.message || error?.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleToogleSite = async (e, status, id) => {
    try {
      const response = await sendPatchRequest(
        `${import.meta.env.VITE_API_URL}/api/site-switch/toggle-is-active/${id}`
      );
      toast({
        title: status ? 'Deactivate Successfully' : 'Activate Successfully',
        status: status ? 'warning' : 'success',
        duration: 2000,
        isClosable: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast({
        title: error?.response?.data?.message || error?.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;
  const permissionDetails = user?.user?.permissions;
  let hasPermission = checkPermission(permissionDetails, 'siteManage');
  let check = !isOwnerAdmin ? hasPermission : true;

  return (
    <div className=" px-4 sm:px-2 lg:px-2 py-4">
      <h1
        style={{ color: iconColor }}
        className="text-2xl sm:text-3xl font-bold text-center mb-2"
      >
        {t('Website')} {t('Manage')}
      </h1>

      {check && (
        <div className="flex justify-end mb-4">
          <AddMoreSite getSiteDetails={getSiteDetails} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <LoadingSpinner size="lg" thickness="4px" color={iconColor} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 3xl:grid-cols-6 gap-2">
          {siteData.map((item, index) => (
            <div
              key={item._id}
              style={{ backgroundColor: bg }}
              className="p-6 rounded-lg shadow-md border border-gray-200"
            >
              <div className="space-y-4">
                {/* Row 1: Full Name and Company Name */}
                <div className="flex flex-col">
                    <label className="font-semibold text-sm text-white mb-1">
                      Full Name:
                    </label>
                    <input
                      type="text"
                      style={{ backgroundColor: secondaryBg }}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={item.full_name || ''}
                      onChange={(e) =>
                        handleChange(index, 'full_name', e.target.value)
                      }
                    />
                  </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="font-semibold text-sm text-white mb-1">
                      Name:
                    </label>
                    <input
                      type="text"
                      style={{ backgroundColor: secondaryBg }}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={item.name || ''}
                      onChange={(e) =>
                        handleChange(index, 'name', e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold text-sm text-white mb-1">
                      Company Name:
                    </label>
                    <input
                      type="text"
                      style={{ backgroundColor: secondaryBg }}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={item.company_name || ''}
                      onChange={(e) =>
                        handleChange(index, 'company_name', e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Row 2: Phone and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="font-semibold text-sm text-white mb-1">
                      Phone No:
                    </label>
                    <input
                      type="text"
                      style={{ backgroundColor: secondaryBg }}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={item.phone || ''}
                      onChange={(e) =>
                        handleChange(index, 'phone', e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold text-sm text-white mb-1">
                      Email:
                    </label>
                    <input
                      type="text"
                      style={{ backgroundColor: secondaryBg }}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={item.email || ''}
                      onChange={(e) =>
                        handleChange(index, 'email', e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Single Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Site Url', key: 'site_url', value: item.site_url, disabled: false, type:"text" },
                  { label: 'Priority', key: 'priority', value: item.priority , disabled: false, type:"number"},
                  {
                    label: 'Site Name',
                    key: 'site_name',
                    value: item.site_name,
                    disabled: false,
                    type:"text" 
                  },
                  {
                    label: 'Site Auth Key',
                    key: 'site_auth_key',
                    value: item.site_auth_key,
                    disabled: true,
                    type:"text" 
                  },
                ].map((field) => (
                  <div key={field.key} className="flex flex-col">
                    <label className="font-semibold text-sm text-white mb-1">
                      {field.label}:
                    </label>
                    <input
                      type="text"
                      style={{ backgroundColor: secondaryBg }}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={field.value || ''}
                      onChange={(e) =>
                        handleChange(index, field.key, e.target.value)
                      }
                      disabled={field.disabled}
                    />
                  </div>
                ))}
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold text-sm text-white mb-1">
                    Is Active:
                  </label>
                  <div className="flex items-center justify-between">
                    {check && (
                      <Switch
                        onChange={(e) =>
                          handleToogleSite(e, item?.is_active, item._id)
                        }
                        colorScheme="green"
                        isChecked={item?.is_active}
                      />
                    )}
                    <span
                      className={`font-bold text-sm ${
                        item?.is_active ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {item?.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {check && (
                  <button
                    style={{ backgroundColor: hoverColor }}
                    className="w-full text-white font-semibold py-2 px-4 rounded-md hover:opacity-90 transition-opacity flex items-center justify-center"
                    onClick={() => handleUpdate(index, item._id)}
                    disabled={updateLoading && item._id === active}
                  >
                    {updateLoading && item._id === active ? (
                      <LoadingSpinner size="sm" thickness="3px" color="white" />
                    ) : (
                      t('Update')
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SiteManage;